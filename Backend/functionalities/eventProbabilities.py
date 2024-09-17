from pydantic import BaseModel
from typing import List, Optional


class ProbabilityRequest(BaseModel):
    data: List[float]
    event_type: str  
    value_x: Optional[float] = None 
    range_a: Optional[float] = None 
    range_b: Optional[float] = None 
    groupsOf: Optional[int] = None


def equalX(data: list[float], x:float) -> float:
    return len(list(filter(lambda z: z == x, data))) / len(data)


def lessThanX(data: list[float], x: float) -> float:
    return len(list(filter(lambda z: z < x, data))) / len(data)


def lessEqualThanX(data: list[float], x: float) -> float:
    return len(list(filter(lambda z: z <= x, data))) / len(data)


def greaterThanX(data: list[float], x: float) -> float:
    return len(list(filter(lambda z: z > x, data))) / len(data)


def greaterEqualThanX(data: list[float], x: float) -> float:
    return len(list(filter(lambda z: z >= x, data))) / len(data)


def inRangeCloseOpen(data: list[float], a: float, b: float) -> float:
    return len(list(filter(lambda z: a <= z < b, data))) / len(data)


def inRangeCloseClose(data: list[float], a: float, b: float) -> float:
    return len(list(filter(lambda z: a <= z <= b, data))) / len(data)


def inRangeOpenClose(data: list[float], a: float, b: float) -> float:
    return len(list(filter(lambda z: a < z <= b, data))) / len(data)


def inRangeOpenOpen(data: list[float], a: float, b: float) -> float:
    return len(list(filter(lambda z: a < z < b, data))) / len(data)


#########################################################################


def groupEqualX(data: list[float], x: float, groupsOf: int) -> float:
    n = len(data) // groupsOf
    return len(list(filter(lambda z: z == x, data[:n + 1]))) / n


def groupLessThanX(data: list[float], x: float, groupsOf: int) -> float:
    n = len(data) // groupsOf
    return len(list(filter(lambda z: z < x, data[:n + 1]))) / n


def groupLessEqualThanX(data: list[float], x: float, groupsOf: int) -> float:
    n = len(data) // groupsOf
    return len(list(filter(lambda z: z <= x, data[:n + 1]))) / n


def groupGreaterThanX(data: list[float], x: float, groupsOf: int) -> float:
    n = len(data) // groupsOf
    return len(list(filter(lambda z: z > x, data[:n + 1]))) / n


def groupGreaterEqualThanX(data: list[float], x: float, groupsOf: int) -> float:
    n = len(data) // groupsOf
    return len(list(filter(lambda z: z >= x, data[:n + 1]))) / n


def groupInRangeCloseOpen(data: list[float], a: float, b: float, groupsOf: int) -> float:
    n = len(data) // groupsOf
    return len(list(filter(lambda z: a <= z < b, data[:n + 1]))) / n


def groupInRangeCloseClose(data: list[float], a: float, b: float, groupsOf: int) -> float:
    n = len(data) // groupsOf
    return len(list(filter(lambda z: a <= z <= b, data[:n + 1]))) / n


def groupInRangeOpenClose(data: list[float], a: float, b: float, groupsOf: int) -> float:
    n = len(data) // groupsOf
    return len(list(filter(lambda z: a < z <= b, data[:n + 1]))) / n


def groupInRangeOpenOpen(data: list[float], a: float, b: float, groupsOf: int) -> float:
    n = len(data) // groupsOf
    return len(list(filter(lambda z: a < z < b, data[:n + 1]))) / n


##############################################################################################


def conditional_probability(data: List[float], eventA_func, eventB_func, kwargsA, kwargsB) -> float:
    data_B = list(filter(lambda x: eventB_func([x], **kwargsB) > 0, data))
    return len(list(filter(lambda z: eventA_func([z], **kwargsA), data_B))) / len(data_B)