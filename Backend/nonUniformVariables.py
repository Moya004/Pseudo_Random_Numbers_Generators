from abc import abstractmethod, ABC
from pydantic import BaseModel
from math import log as ln

class DistributionRequest(BaseModel):
    dist: str
    data: list[float]

class ProbabilityDistribution(ABC):

    @abstractmethod
    def trasnformToVariable(self, data: list[float]) -> list[float]: ...


class Exponential(ProbabilityDistribution):

    def trasnformToVariable(self, data: list[float], mean: float) -> list[float]:
        res = []
        for val in data:
            res.append(-mean * ln(val) if val > 0 else mean)
        return res
    

