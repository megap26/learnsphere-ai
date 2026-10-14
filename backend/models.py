from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ChunkLocation(BaseModel):
    page: Optional[int] = None
    slide: Optional[int] = None
    timestamp: Optional[str] = None
    paragraph: Optional[int] = None

class MaterialChunkModel(BaseModel):
    id: str
    materialId: str
    materialTitle: str
    materialType: str
    location: ChunkLocation
    locationString: str
    text: str
    topic: str
    subtopic: str

class CitationModel(BaseModel):
    id: str
    materialId: str
    materialTitle: str
    materialType: str
    locationString: str
    excerpt: str
    confidenceScore: float

class ChatRequest(BaseModel):
    query: str
    style: Optional[str] = "standard"
    filterTopic: Optional[str] = None

class ChatResponse(BaseModel):
    id: str
    sender: str = "assistant"
    text: str
    timestamp: int
    citations: List[CitationModel] = []
    isRefusal: bool = False
    outsideKnowledgeNote: Optional[str] = None
    followUpQuestions: List[str] = []
    explanationStyle: str = "standard"

class BKTUpdateRequest(BaseModel):
    topic: str
    currentPL: float = 0.30
    isCorrect: bool
    pT: float = 0.15
    pG: float = 0.20
    pS: float = 0.10

class BKTUpdateResponse(BaseModel):
    topic: str
    previousPL: float
    updatedPL: float
    delta: float
    status: str
    recommendedAction: str

class QuestionVerificationRequest(BaseModel):
    questionText: str
    options: List[str]
    correctAnswer: str
    topic: str
    chunkId: Optional[str] = None

class EvaluationRequest(BaseModel):
    benchmarkSubset: Optional[str] = "all"
