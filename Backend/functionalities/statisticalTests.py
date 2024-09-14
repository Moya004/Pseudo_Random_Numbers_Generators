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
        
        Xo2 = chi2.ppf(0.95, int(len(FoS)) - 1)

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

        
class PruebaPoker(StatisticalTest):
    def test(self, data:list[float]) -> bool:
        from collections import Counter, defaultdict as ddict

        probabilidades = {'D': 0.30240, '1P': 0.50400, '2P': 0.10800, 'T': 0.07200, 'TP': 0.00900, 'PK': 0.00450, 'Q': 0.00010}
        Fe = {hand: len(data) * probabilidades[hand] for hand in probabilidades}
        parsedData = self.__parsear(data)

        Fo = {hand: 0 for hand in probabilidades}

        for val in parsedData:
            amount = ddict(int, Counter(list(Counter(val).values())))
            if amount[5]:
                Fo['Q'] += 1
            elif amount[4]:
                Fo['PK'] += 1
            elif amount[3] and amount[2]:
                Fo['TP'] += 1
            elif amount[3]:
                Fo['T'] += 1
            elif amount[2] > 1:
                Fo['2P'] += 1
            elif amount[2]:
                Fo['1P'] += 1
            else:
                Fo['D'] += 1

        Xo = sum(map(lambda x: (Fo[x] - Fe[x])**2 / Fe[x], probabilidades))

        Xo2 = chi2.ppf(0.95, 6)

        return bool(Xo < Xo2)

    def __parsear(self, data: list[float]) -> list[str]:
        res = []
        for val in data:
            str_val = str(val)[2:7]
            str_val += '0' * (5 - len(str_val))
            res.append(str_val)

        return res

class PruebaKolmogorovSmirnov(StatisticalTest):
    
    def test(self, data: list[float]) -> bool:
        valores = [
            0.97500, 0.84189, 0.70760, 0.62304, 0.56328, 0.51926, 0.48342, 0.45427, 0.43001, 0.40925,
            0.39122, 0.37543, 0.36143, 0.34890, 0.33750, 0.32733, 0.31796, 0.30936, 0.30143, 0.29408,
            0.28724, 0.28087, 0.27491, 0.26931, 0.26404, 0.25908, 0.25438, 0.24993, 0.24571, 0.24170,
            0.23788, 0.23424, 0.23076, 0.22743, 0.22425, 0.22119, 0.21826, 0.21544, 0.21273, 0.21012,
            0.20760, 0.20517, 0.20283, 0.20056, 0.19837, 0.19625, 0.19420, 0.19221, 0.19028, 0.18841
        ]
        
        if len(data) <= 50:
            dn = valores[len(data)-1]
        else:
            dn = 1.36 / (len(data)**0.5)

        ordenados = sorted(data)
        Fi = [(i + 1) / len(data) for i in range(len(data))]

        Dn = max(map(lambda x, y: abs(x - y), ordenados, Fi))

        return bool(Dn < dn)
