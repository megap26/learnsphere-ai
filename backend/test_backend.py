import pytest
from bkt_engine import compute_bkt_update, get_topic_status
from rag_engine import search_chunks, tokenize

def test_bkt_math_updates():
    prior = 0.30
    post_corr = compute_bkt_update(prior, True)
    assert post_corr > prior
    assert post_corr > 0.65

    post_inc = compute_bkt_update(0.70, False)
    assert post_inc < 0.70

def test_bkt_status_thresholds():
    assert get_topic_status(0.85) == "Mastered"
    assert get_topic_status(0.60) == "Practicing"
    assert get_topic_status(0.35) == "Needs Attention"

def test_rag_retrieval_and_refusal():
    chunks = [
        {
            "id": "c1",
            "materialTitle": "Deep Learning Book",
            "topic": "Optimization",
            "subtopic": "Gradient Descent",
            "locationString": "p. 14",
            "text": "Gradient descent minimizes the cost function J(theta) by stepping in negative gradient direction with learning rate eta."
        }
    ]

    # Supported query
    results, is_confident, _ = search_chunks("learning rate gradient descent", chunks)
    assert is_confident is True
    assert len(results) == 1
    assert results[0]["id"] == "c1"

    # Unsupported query
    _, is_confident_unsupported, refusal_msg = search_chunks("quantum teleportation in superconductors", chunks)
    assert is_confident_unsupported is False
    assert "not contain sufficient evidence" in refusal_msg
