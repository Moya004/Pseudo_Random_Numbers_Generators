from abc import abstractmethod, ABC
from scipy.stats import chi2
from pydantic import BaseModel
from typing import List


class StatisticalTest(ABC):
    
    @abstractmethod
    def test(self, data: list[float]) -> bool: ...


class TestRequest(BaseModel):
    prueba: str
    datos: List[float]

class PruebaPromedios(StatisticalTest):
    
    def test(self, data: list[float]) -> bool:
        mean = sum(data) / len(data)
        Zo = (mean -  0.5) * len(data) ** 0.5  / (1/12) ** 0.5

        return bool(abs(Zo) < 1.96)
    

class PruebaFrecuencias(StatisticalTest):

    def test(self, data: list[float]) -> bool:
        
        FoS, Fe = self.__FeFo(data)
        sumatoria = 0
        for Fo in FoS:
            sumatoria += (Fo - Fe) ** 2

        Xo = sumatoria / Fe
        
        Xo2 = chi2.ppf(0.95, int(len(FoS) ** 0.5) - 1)

        return bool(Xo < Xo2)

    def __FeFo(self, datos: list[float]) -> tuple:
        N = len(datos)
        m = int(N ** 0.5)  # Cantidad de rangos
        Fo = [0 for _ in range(m)]  # Inicializar frecuencias observadas

        # Calcular el ancho de cada rango
        rango_ancho = 1 / m

        # Contar elementos en cada rango
        for valor in datos:
            indice_rango = int(valor / rango_ancho)

            # Si el valor es exactamente 1, ajustar el índice para el último rango
            if indice_rango == m:
                indice_rango -= 1

            Fo[indice_rango] += 1
        Fe = N / m  # Frecuencia esperada en cada rango
        return Fo, Fe
    
class PruebaSeries(StatisticalTest):
    
    def test(self, data: list[float]) -> bool:
        pairs = [(x, y) for x, y in zip(data, data[1:])]
        
        Xo = self.__estadistico(pairs)
        Xo2 = chi2.ppf(0.95, len(data) - 1)
        
        return bool(Xo < Xo2)

    def __estadistico(self, pairs: list[tuple]) -> float:
        N = len(pairs)
        m = int((N + 1) ** 0.5)
        Fo = [[0 for _ in range(m)] for _ in range(m)]

        for pair in pairs:
            i = int(pair[0] * m)
            j = int(pair[1] * m)

            if i == m:
                i -= 1
            if j == m:
                j -= 1
            
            Fo[i][j] += 1

        sumatoria = 0
        for index in Fo:
            for val in index:
                sumatoria += (val - (N / m**2)) ** 2

        return sumatoria * ((N + 1) / N)

        
        


class PruebaKolmogorovSmirnov(StatisticalTest):
    
    def test(self, data: list[float]) -> bool:
        pass