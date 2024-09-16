from fastapi import FastAPI, Form, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from functionalities.generators import MersenneTwister, XORShift, BBS, CongruencialMixto, Multiplicativo
from functionalities.statisticalTests import PruebaFrecuencias, PruebaPromedios, PruebaSeries, PruebaKolmogorovSmirnov, PruebaPoker, TestRequest
from functionalities.nonUniformVariables import DistributionRequest, Poisson, Exponential, UniformAB

from functionalities.eventProbabilities import *

import csv
from io import StringIO


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

@app.post('/import', response_class=JSONResponse)
async def Import(archivo: UploadFile = File(...)) -> List[float]:
    contenido = await archivo.read()

    archivo_csv = StringIO(contenido.decode("utf-8"))
    lector_csv = csv.reader(archivo_csv)
    
    res = []

    for line in lector_csv:
        for num in line:
            res.append(float(num))

    return JSONResponse(res)

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
async def test(request: TestRequest):
    
    match request.prueba:

        case 'Promedios':
            tester = PruebaPromedios()

        case 'Frecuencias':
            tester = PruebaFrecuencias()

        case 'Kolmogorov-smirnov':
            tester = PruebaKolmogorovSmirnov()

        case 'Series':
            tester = PruebaSeries()
            
        case 'Poker':
            tester = PruebaPoker()
        case _:
            return JSONResponse({"error": "Invalid test selected"}, status_code=400)
        
    
    return JSONResponse({'passed' : tester.test(data= request.datos)})


@app.post('/transformToVariable', response_class=JSONResponse)
async def transform(request: DistributionRequest) -> List[float]:

    rango_tuple = tuple(request.rango)

    match request.dist:
        
        case 'Distribución Exponencial':
            transformer = Exponential()
        
        case 'Distribución Poisson':
            transformer = Poisson()

        case 'Distribución Uniforme entre a - b':
            transformer = UniformAB()

        case _:
            return JSONResponse({"error": "Invalid distribution selected"}, status_code=400)
    
    return JSONResponse(transformer.trasnformToVariable(data=request.data, mean=request.mean, rango=rango_tuple))


@app.post('/experiment', response_class=JSONResponse)
async def experiment(request: ProbabilityRequest):
    data = request.data
    event_type = request.event_type

    match event_type:
        # Eventos simples
        case "equalX":
            return {"probability": equalX(data, request.value_x)}
        case "lessThanX":
            return {"probability": lessThanX(data, request.value_x)}
        case "lessEqualThanX":
            return {"probability": lessEqualThanX(data, request.value_x)}
        case "greaterThanX":
            return {"probability": greaterThanX(data, request.value_x)}
        case "greaterEqualThanX":
            return {"probability": greaterEqualThanX(data, request.value_x)}
        case "inRangeCloseOpen":
            return {"probability": inRangeCloseOpen(data, request.range_a, request.range_b)}
        case "inRangeCloseClose":
            return {"probability": inRangeCloseClose(data, request.range_a, request.range_b)}
        case "inRangeOpenClose":
            return {"probability": inRangeOpenClose(data, request.range_a, request.range_b)}
        case "inRangeOpenOpen":
            return {"probability": inRangeOpenOpen(data, request.range_a, request.range_b)}

        # Eventos agrupados
        case "groupEqualX":
            return {"probability": groupEqualX(data, request.value_x, request.groupsOf)}
        case "groupLessThanX":
            return {"probability": groupLessThanX(data, request.value_x, request.groupsOf)}
        case "groupLessEqualThanX":
            return {"probability": groupLessEqualThanX(data, request.value_x, request.groupsOf)}
        case "groupGreaterThanX":
            return {"probability": groupGreaterThanX(data, request.value_x, request.groupsOf)}
        case "groupGreaterEqualThanX":
            return {"probability": groupGreaterEqualThanX(data, request.value_x, request.groupsOf)}
        case "groupInRangeCloseOpen":
            return {"probability": groupInRangeCloseOpen(data, request.range_a, request.range_b, request.groupsOf)}
        case "groupInRangeCloseClose":
            return {"probability": groupInRangeCloseClose(data, request.range_a, request.range_b, request.groupsOf)}
        case "groupInRangeOpenClose":
            return {"probability": groupInRangeOpenClose(data, request.range_a, request.range_b, request.groupsOf)}
        case "groupInRangeOpenOpen":
            return {"probability": groupInRangeOpenOpen(data, request.range_a, request.range_b, request.groupsOf)}

        case _:
            return {"error": "Event type not supported"}



@app.post('/conditional_experiment', response_class=JSONResponse)
async def cond_experiment(request: ProbabilityRequest) -> float:
    pass



if __name__ == "__main__":
    import uvicorn
    uvicorn.run('main:app', host='0.0.0.0')
