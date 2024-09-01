from fastapi import FastAPI, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from generators import MersenneTwister, XORShift, BBS, CongruencialMixto, Multiplicativo
from statisticalTests import PruebaFrecuencias, PruebaPromedios

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],  # Permitir todas las fuentes
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
async def home():
    return {'Succesfuly':'Connected'}


@app.post("/generate", response_class=JSONResponse)
async def generate(algorithm: str = Form(...),
                   count: int = Form(...),
                   b: int = Form(None),  
                   seed: int = Form(None),
                   p: int = Form(None), 
                   q: int = Form(None), 
                   a: int = Form(None), 
                   c: int = Form(None), 
                   m: int = Form(None)) -> List[float]:
    
    if algorithm == "XOR_Shift":
        generator = XORShift(b=b or 17, a=a or 13, c=c or 5, semilla=seed)
    elif algorithm == "mersenne_twister":
        generator = MersenneTwister(semilla=seed or 789)
    elif algorithm == "blum_blum_shub":
        generator = BBS(p=p or 14879, q=q or 19867, semilla=seed)
    elif algorithm == "congruencial_mixto":
        generator = CongruencialMixto(a=a, c=c, m=m, semilla=seed)
    elif algorithm == "congruencial_multiplicativo":
        generator = Multiplicativo(a=a, m=m, semilla=seed)
    else:
        return JSONResponse({"error": "Invalid algorithm selected"}, status_code=400)

    scaled_numbers = [generator.random() for _ in range(count)]
    
    return JSONResponse(scaled_numbers)


@app.post('/test', response_class=JSONResponse)
async def test(prueba: str = Form(...),
               datos: List[float] = Form(...)) -> bool:
    
    match prueba:

        case 'Promedios':
            tester = PruebaPromedios()

        case 'Frecuencias':
            tester = PruebaFrecuencias()

        case 'Kolmogorov-smirnov':
            pass

        case _:
            return JSONResponse({"error": "Invalid test selected"}, status_code=400)
        
    
    return JSONResponse(tester.test(data= datos))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run('main:app', host="0.0.0.0")
