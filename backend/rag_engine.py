import re
import math
from typing import List, Dict, Any, Tuple

STOPWORDS = {
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
    'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being',
    'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot', 'could',
    'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from',
    'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'how',
    'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more',
    'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only',
    'or', 'other', 'ought', 'our', 'ours', 'out', 'over', 'own', 'same', 'she',
    'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them',
    'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under',
    'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which',
    'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours'
}

def tokenize(text: str) -> List[str]:
    cleaned = re.sub(r'[^a-zA-Z0-9_\-\s]', ' ', text.lower())
    return [t for t in cleaned.split() if len(t) > 2 and t not in STOPWORDS]

def search_chunks(query: str, chunks: List[Dict[str, Any]], filter_topic: str = None, threshold: float = 0.20) -> Tuple[List[Dict[str, Any]], bool, str]:
    tokens = tokenize(query)
    if not tokens or not chunks:
        return [], False, "Query contains insufficient keywords."

    # Document frequency
    doc_freq = {}
    for token in tokens:
        doc_freq[token] = sum(1 for c in chunks if token in (c.get('text', '') + ' ' + c.get('topic', '')).lower())

    n = len(chunks)
    scored = []

    for chunk in chunks:
        if filter_topic and chunk.get('topic', '').lower() != filter_topic.lower():
            continue

        c_tokens = tokenize(chunk.get('text', '') + ' ' + chunk.get('topic', '') + ' ' + chunk.get('subtopic', ''))
        total_score = 0.0

        for token in tokens:
            count = sum(1 for t in c_tokens if token in t or t in token)
            if count > 0:
                tf = count / max(1, len(c_tokens))
                df = doc_freq.get(token, 1)
                idf = math.log(1 + (n / (1 + df)))
                topic_bonus = 1.5 if token in chunk.get('topic', '').lower() else 1.0
                total_score += tf * idf * topic_bonus * 10

        if total_score > 0:
            scored.append((chunk, round(total_score, 4)))

    scored.sort(key=lambda x: x[1], reverse=True)
    top = scored[:3]

    if not top or top[0][1] < threshold:
        return [], False, "The uploaded materials do not contain sufficient evidence to answer this question without hallucination."

    return [t[0] for t in top], True, ""
