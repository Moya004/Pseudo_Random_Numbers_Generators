from abc import abstractmethod, ABC
from pydantic import BaseModel
from math import log as ln
from scipy.stats import poisson

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


class Poisson(ProbabilityDistribution):
    def trasnformToVariable(self, data: list[float], mean: float) -> list[float]:
        res = []
        lamd_3 = [float(poisson.cdf(k, mean)) for k in range(int(3 * mean) + 1)]

        for target in data:
            left, right = 0, len(lamd_3) - 1
            while left <= right:

                mid = left + (right - left) // 2

                if lamd_3[mid] == target:
                    break

                elif lamd_3[mid] < target:
                    left = mid + 1

                else:
                    right = mid - 1
            res.append(left)

        return res
