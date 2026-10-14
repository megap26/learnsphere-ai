"""
Bayesian Knowledge Tracing (BKT) Engine in Python
Based on Corbett & Anderson (1994) latent state knowledge tracing.
"""

def compute_bkt_update(current_pl: float, is_correct: bool, pt: float = 0.15, pg: float = 0.20, ps: float = 0.10) -> float:
    """
    Computes posterior probability of concept mastery given observation.
    
    Formula:
      P(L_t | Correct) = [P(L_{t-1}) * (1 - P(S))] / [P(L_{t-1}) * (1 - P(S)) + (1 - P(L_{t-1})) * P(G)]
      P(L_t | Incorrect) = [P(L_{t-1}) * P(S)] / [P(L_{t-1}) * P(S) + (1 - P(L_{t-1})) * (1 - P(G))]
      P(L_{t+1}) = P(L_t | Obs) + (1 - P(L_t | Obs)) * P(T)
    """
    if is_correct:
        num = current_pl * (1.0 - ps)
        den = num + (1.0 - current_pl) * pg
        p_l_obs = num / den if den > 0 else current_pl
    else:
        num = current_pl * ps
        den = num + (1.0 - current_pl) * (1.0 - pg)
        p_l_obs = num / den if den > 0 else current_pl

    next_pl = p_l_obs + (1.0 - p_l_obs) * pt
    return round(max(0.01, min(0.99, next_pl)), 4)

def get_topic_status(p_l: float) -> str:
    if p_l >= 0.80:
        return "Mastered"
    elif p_l >= 0.50:
        return "Practicing"
    return "Needs Attention"

def get_recommendation(p_l: float, topic: str) -> str:
    if p_l < 0.45:
        return f"Priority revision required: BKT estimate is {int(p_l * 100)}%. Review foundational definitions and attempt introductory questions."
    elif p_l < 0.80:
        return f"Active reinforcement: BKT estimate is {int(p_l * 100)}%. Practice medium-level problems to solidify calculus and parameter updates."
    return f"High mastery achieved: BKT estimate is {int(p_l * 100)}%. Proceed to advanced edge-case exam synthesis."
