from abc import abstractmethod, ABC

class StatisticalTest(ABC):
    
    @abstractmethod
    def test(self, data: list[int]) -> bool: ...


class PruebaPromedios(StatisticalTest):
    
    def test(self, data: list[int]) -> bool:
        mean = sum(data) / len(data)
        Zo = (mean -  0.5) * len(data) ** 0.5  / (1/12) ** 0.5

        return abs(Zo) < 1.96
    

class PruebaFrecuencias(StatisticalTest):

    def test(self, data: list[int]) -> bool:
        from scipy.stats import chi2
        
        mean = sum(data) / len(data)
        FoS, Fe = self.__FeFo(data)
        sumatoria = 0
        for Fo in FoS:
            sumatoria += (Fo - Fe) ** 2

        Xo = sumatoria / Fe
        
        Xo2 = chi2.ppf(0.95, len(FoS) ** 0.5)

        return Xo < Xo2

    def __FeFo(self, datos: list[float]) -> tuple:
        N = len(datos)
        m = int(N ** 0.5)  # Cantidad de rangos
        Fo = [0] * m  # Inicializar frecuencias observadas

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