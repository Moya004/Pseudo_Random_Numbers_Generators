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
        f = lambda x: -mean * ln(x)
        for val in data:
            res.append(f(val) if val > 0 else mean)
        return res
    

class UniformAB(ProbabilityDistribution):

    def trasnformToVariable(self, data: list[float], rango: tuple[float]) -> list[float]:
        res = []
        f = lambda x: rango[0] + (rango[1] - rango[0]) * x
        for val in data:
            res.append(f(val))
        
        return res
