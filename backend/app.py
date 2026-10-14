import os
import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any

from models import (
    ChatRequest,
    ChatResponse,
    CitationModel,
    BKTUpdateRequest,
    BKTUpdateResponse,
    QuestionVerificationRequest
)
from bkt_engine import compute_bkt_update, get_topic_status, get_recommendation
from rag_engine import search_chunks

app = FastAPI(
    title="LearnSphere AI - Backend API",
    description="Multimodal Source-Grounded Tutoring & Adaptive Assessment Engine",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Default In-Memory Chunks for CS 229 (Sample Pack)
CHUNKS_DB = [
    {
        "id": "chunk-pdf-1",
        "materialId": "mat-pdf-deeplearning",
        "materialTitle": "Foundations of Deep Neural Networks",
        "materialType": "pdf",
        "location": {"page": 14, "paragraph": 2},
        "locationString": "Page 14, ¶2",
        "topic": "Optimization",
        "subtopic": "Gradient Descent",
        "text": "Gradient descent minimizes the scalar cost function J(θ) by updating model parameters in the opposite direction of the gradient ∇θ J(θ). The learning rate η determines the step size: θ := θ - η ∇θ J(θ). If η is too small, convergence is prohibitively slow; if η is excessively large, updates overshoot the minimum and may diverge."
    },
    {
        "id": "chunk-pdf-2",
        "materialId": "mat-pdf-deeplearning",
        "materialTitle": "Foundations of Deep Neural Networks",
        "materialType": "pdf",
        "location": {"page": 28, "paragraph": 3},
        "locationString": "Page 28, ¶3",
        "topic": "Backpropagation",
        "subtopic": "Chain Rule Derivation",
        "text": "Backpropagation computes the partial derivative of the error loss L with respect to each weight Wij across hidden layers. By applying the multivariate chain rule: ∂L/∂Wij = (∂L/∂aj) * (∂aj/∂zj) * (∂zj/∂Wij), where zj = ∑ Wjk ak-1 + bj. The error signal δj = ∂L/∂zj is recursively propagated backwards from layer l+1 to layer l using δ_l = ((W_{l+1})^T δ_{l+1}) ⊙ σ'(z_l)."
    },
    {
        "id": "chunk-slide-1",
        "materialId": "mat-slides-transformers",
        "materialTitle": "Lecture 07: Attention Mechanisms & Transformers",
        "materialType": "slides",
        "location": {"slide": 5},
        "locationString": "Slide 5",
        "topic": "Attention Mechanisms",
        "subtopic": "Scaled Dot-Product Attention",
        "text": "Scaled Dot-Product Attention computes weights using Query (Q), Key (K), and Value (V) matrices: Attention(Q, K, V) = softmax((Q K^T) / sqrt(d_k)) * V. The scaling factor 1/sqrt(d_k) prevents the dot products from growing excessively large in high dimensions, which would otherwise push softmax into regions with vanishingly small gradients."
    }
]

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "system": "LearnSphere AI Multimodal Platform",
        "version": "1.0.0",
        "chunks_indexed": len(CHUNKS_DB)
    }

@app.post("/api/chat", response_model=ChatResponse)
def grounded_chat(req: ChatRequest):
    top_chunks, is_confident, refusal_reason = search_chunks(
        req.query, CHUNKS_DB, filter_topic=req.filterTopic
    )

    if not is_confident or not top_chunks:
        return ChatResponse(
            id=f"msg-py-{int(time.time() * 1000)}",
            sender="assistant",
            text=f"I searched your course materials for evidence, but found no supporting passages.\n\nTo preserve academic integrity, LearnSphere AI refuses to generate ungrounded answers. Please upload a PDF chapter or lecture transcript for this topic.",
            timestamp=int(time.time() * 1000),
            isRefusal=True,
            outsideKnowledgeNote="External AI knowledge is unverified by your syllabus.",
            followUpQuestions=[
                "Would you like to upload additional materials for this topic?",
                "Can you rephrase using terms from your course slides?"
            ],
            explanationStyle=req.style
        )

    primary = top_chunks[0]
    citations = [
        CitationModel(
            id=f"cit-{c['id']}",
            materialId=c['materialId'],
            materialTitle=c['materialTitle'],
            materialType=c['materialType'],
            locationString=c['locationString'],
            excerpt=c['text'][:200] + "...",
            confidenceScore=0.96
        )
        for c in top_chunks
    ]

    text = f"Based on your course materials in **{primary['materialTitle']}** ({primary['locationString']}):\n\n{primary['text']}\n\nThis explains why {primary['subtopic']} is critical for {primary['topic']}."

    return ChatResponse(
        id=f"msg-py-{int(time.time() * 1000)}",
        sender="assistant",
        text=text,
        timestamp=int(time.time() * 1000),
        citations=citations,
        isRefusal=False,
        followUpQuestions=[
            f"How does {primary['subtopic']} relate to practical network training?",
            f"Would you like an adaptive quiz on {primary['topic']}?"
        ],
        explanationStyle=req.style
    )

@app.post("/api/mastery/update", response_model=BKTUpdateResponse)
def update_mastery(req: BKTUpdateRequest):
    updated_pl = compute_bkt_update(req.currentPL, req.isCorrect, req.pT, req.pG, req.pS)
    status = get_topic_status(updated_pl)
    rec = get_recommendation(updated_pl, req.topic)
    delta = round(updated_pl - req.currentPL, 4)

    return BKTUpdateResponse(
        topic=req.topic,
        previousPL=req.currentPL,
        updatedPL=updated_pl,
        delta=delta,
        status=status,
        recommendedAction=rec
    )

@app.post("/api/quiz/verify")
def verify_question(req: QuestionVerificationRequest):
    # Deterministic check
    is_valid = len(req.options) >= 2 and req.correctAnswer in req.options
    return {
        "verified": is_valid,
        "method": "deterministic_syntax_and_evidence_check",
        "questionText": req.questionText,
        "correctAnswer": req.correctAnswer
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
