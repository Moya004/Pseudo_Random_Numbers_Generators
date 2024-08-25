class MersenneTwister:
    def __init__(self, semilla: int) -> None:
        self.__bits, self.__n, self.__M, self.__T = 32, 624, 397, 31
        self.a = 0x9908B0DF
        self.u, self.d = 11, 0xFFFFFFFF
        self.s, self.b = 7, 0x9D2C5680
        self.t, self.c = 15, 0xEFC60000
        self.l = 18
        self.f = 1812433253

        self.__lower_mask = (1 << self.__T) - 1
        self.__upper_mask = self.d & ~self.__lower_mask

        self.__mt = [0] * self.__n
        self.__index = self.__n + 1

        self.__mt[0] = semilla
        for i in range(1, self.__n):
            self.__mt[i] = (self.f * (self.__mt[i-1] ^ (self.__mt[i-1] >> (self.__bits - 2))) + i) & self.d
        self.__twist()

    def __twist(self) -> None:
        for i in range(self.__n):
            x = (self.__mt[i] & self.__upper_mask) + (self.__mt[(i+1) % self.__n] & self.__lower_mask)
            xA = x >> 1
            if x % 2 != 0:
                xA = xA ^ self.a
            self.__mt[i] = self.__mt[(i + self.__M) % self.__n] ^ xA
        self.__index = 0

    def __obtener_numero(self) -> int:
        if self.__index >= self.__n:
            if self.__index > self.__n:
                raise Exception("No se inicializó el generador")
            self.__twist()

        y = self.__mt[self.__index]
        y = y ^ ((y >> self.u) & self.d)
        y = y ^ ((y << self.s) & self.b)
        y = y ^ ((y << self.t) & self.c)
        y = y ^ (y >> self.l)

        self.__index += 1
        return y & self.d
    
    def random_pair(self) -> tuple:
        res = self.__obtener_numero()
        return (res, res / (2 ** 32))
    
    def random_int(self) -> int:
        res = self.__obtener_numero()
        return res
    
    def random(self) -> float:
        res = self.__obtener_numero()
        return res / (2 ** 32)
    

class BBS:
    def __init__(self, semilla: int, p: int= 14879, q: int= 19867) -> None:
        self.__n = p * q
        self.__X = semilla
    
    def __obtener_numero(self) -> int:
        self.__X = self.__X ** 2 % self.__n
        return self.__X

    def random_pair(self) -> tuple:
        res = self.__obtener_numero()
        return (res, res / (self.__n - 1))
    
    def random_int(self) -> int:
        res = self.__obtener_numero()
        return res
    
    def random(self) -> float:
        res = self.__obtener_numero()
        return res / (self.__n - 1)
    

class CongruencialMixto:
    def __init__(self, a: int, c: int, m: int, semilla: int) -> None:
        self.__X = semilla
        self.__A = a
        self.__C = c
        self.__M = m

    def __obtener_numero(self) -> None:
        self.__X = (self.__A * self.__X + self.__C) % self.__M
        return self.__X
    
    def random_pair(self) -> tuple:
        res = self.__obtener_numero()
        return (res, res / self.__M )
    
    def random_int(self) -> int:
        res = self.__obtener_numero()
        return res
    
    def random(self) -> float:
        res = self.__obtener_numero()
        return res / self.__M
    

class Multiplicativo:
    def __init__(self, a: int, m: int, semilla: int) -> None:
        self.__X = semilla
        self.__A = a
        self.__M = m

    def __obtener_numero(self) -> None:
        self.__X = (self.__A * self.__X) % self.__M
        return self.__X
    
    def random_pair(self) -> tuple:
        res = self.__obtener_numero()
        return (res, res / (self.__M - 1))
    
    def random_int(self) -> int:
        res = self.__obtener_numero()
        return res
    
    def random(self) -> float:
        res = self.__obtener_numero()
        return res / (self.__M - 1)
    

class XORShift:
    
    def __init__(self, semilla: int, a: int = 13, b: int = 17, c: int = 5) -> None:
        self.__state = semilla
        self.__b = b
        self.__c = c
        self.__a = a

    def __obtener_numero(self) -> None:
        self.__state ^= (self.__state << self.__a) & 0xFFFFFFFF
        self.__state ^= (self.__state >> self.__b) & 0xFFFFFFFF
        self.__state ^= (self.__state << self.__c) & 0xFFFFFFFF
    
        return self.__state & 0xFFFFFFFF
    
    def random_pair(self) -> tuple:
        res = self.__obtener_numero()
        return (res, res / 0xFFFFFFFF)
    
    def random_int(self) -> int:
        res = self.__obtener_numero()
        return res
    
    def random(self) -> float:
        res = self.__obtener_numero()
        return res / 0xFFFFFFFF