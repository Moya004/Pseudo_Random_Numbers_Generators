import React, { useState, useEffect} from 'react';

const AlgorithmForm = ({ onGenerate, reset}) => {
    const [algorithm, setAlgorithm] = useState('');
    const [count, setCount] = useState(10);
    const [params, setParams] = useState({
        b: '',
        seed: '',
        p: '',
        q: '',
        a: '',
        c: '',
        m: ''
    });

    const [errors, setErrors] = useState({});

    const validate = (name, value) => {
        let error = null;
        const intValue = parseInt(value, 10);

        if (name === 'count' && (intValue <= 0 || isNaN(intValue))) {
            error = 'La cantidad de números a generar debe ser mayor que 0.';
        } else if (algorithm === 'congruencial_multiplicativo' || algorithm === 'congruencial_mixto') {
            if (name === 'a') {
                if (intValue <= 1) {
                    error = 'El valor de a debe ser mayor que 1.';
                } else if (params.m && intValue >= params.m) {
                    error = 'El valor de a debe ser menor que m.';
                }
            } else if (name === 'm') {
                if (intValue <= params.a) {
                    error = 'El valor de m debe ser mayor que a.';
                }
            } else if (name === 'seed') {
                if (intValue <= 1) {
                    error = 'El valor de la semilla debe ser mayor que 1.';
                } else if (params.m && intValue >= params.m) {
                    error = 'El valor de la semilla debe ser menor que m.';
                }
            } else if (algorithm === 'congruencial_mixto' && name === 'c' && intValue <= 1) {
                error = 'El valor de c debe ser mayor que 1.';
            }
        } else if (algorithm === 'blum_blum_shub') {
            let pValue = name === 'p' ? intValue : params.p || 14879;
            let qValue = name === 'q' ? intValue : params.q || 19867;

            if (name === 'p') {
                pValue = intValue;
                if (intValue <= 1) {
                    error = 'El valor de p debe ser mayor que 1.';
                } else if (intValue === qValue) {
                    error = 'El valor de p debe ser diferente de q.';
                }
            } else if (name === 'q') {
                qValue = intValue;
                if (intValue <= 1) {
                    error = 'El valor de q debe ser mayor que 1.';
                } else if (intValue === pValue) {
                    error = 'El valor de q debe ser diferente de p.';
                }
            } else if (name === 'seed' && (intValue <= 1 || intValue >= (pValue * qValue))) {
                error = 'El valor de la semilla debe ser mayor que 1 y menor que p*q.';
            }
        } else if (algorithm === 'XOR_Shift') {
            if ((name === 'a' || name === 'b' || name === 'c') && intValue <= 0) {
                error = `El valor de ${name} debe ser positivo.`;
            } else if (name === 'seed' && intValue <= 0) {
                error = 'El valor de la semilla debe ser positivo.';
            }
        } else if (algorithm === 'mersenne_twister' && name === 'seed' && intValue <= 0) {
            error = 'El valor de la semilla debe ser un entero positivo.';
        }

        setErrors(prev => ({ ...prev, [name]: error }));
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setParams(prev => ({ ...prev, [name]: value }));
        validate(name, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!algorithm) {
            alert('Por favor selecciona un algoritmo.');
            return;
        }

        let formIsValid = true;
        Object.keys(params).forEach(key => {
            validate(key, params[key]);
            if (errors[key]) formIsValid = false;
        });

        if (formIsValid) {
            onGenerate(algorithm, count, params);
        } else {
            alert('Por favor corrige los errores antes de continuar.');
        }
    };

        useEffect(() => {
            if (reset) {
                setAlgorithm('');
                setCount(10);
                setParams({
                    b: '',
                    seed: '',
                    p: '',
                    q: '',
                    a: '',
                    c: '',
                    m: ''
                });
                setErrors({});
            }
        }, [reset]);

    return (
        <form className="algorithm-form" onSubmit={handleSubmit}>
            <div>
                <label>Algorithm:</label>
                <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
                    <option value="">Select an algorithm</option>
                    <option value="XOR_Shift">XOR Shift</option>
                    <option value="mersenne_twister">Mersenne Twister</option>
                    <option value="blum_blum_shub">Blum Blum Shub</option>
                    <option value="congruencial_mixto">Congruencial Mixto</option>
                    <option value="congruencial_multiplicativo">Congruencial Multiplicativo</option>
                </select>
            </div>

            <div>
                <label>Count (mayor que 0):</label>
                <input type="number" value={count} onChange={(e) => setCount(e.target.value)} />
                {errors.count && <div className="error">{errors.count}</div>}
            </div>

            {algorithm && (
                <div>
                    <label>Seed (mayor que 1):</label>
                    <input type="number" name="seed" value={params.seed} onChange={handleChange} />
                    {errors.count && <div className="error">{errors.count}</div>}
                </div>
            )}

            {(algorithm === 'XOR_Shift' || algorithm === 'congruencial_mixto' || algorithm === 'congruencial_multiplicativo') && (
                <>
                    <div>
                        <label>a (mayor que 1):</label>
                        <input type="number" name="a" value={params.a} onChange={handleChange} />
                        {errors.count && <div className="error">{errors.count}</div>}
                    </div>

                    {(algorithm === 'XOR_Shift' || algorithm === 'congruencial_mixto') && (
                        <div>
                            <label>c (mayor que 1):</label>
                            <input type="number" name="c" value={params.c} onChange={handleChange} />
                            {errors.count && <div className="error">{errors.count}</div>}
                        </div>
                    )}
                </>
            )}

            {algorithm === 'XOR_Shift' && (
                <div>
                    <label>b (mayor que 1):</label>
                    <input type="number" name="b" value={params.b} onChange={handleChange} />
                    {errors.count && <div className="error">{errors.count}</div>}
                </div>
            )}

            {algorithm === 'blum_blum_shub' && (
                <>
                    <div>
                        <label>p (mayor que 1):</label>
                        <input type="number" name="p" value={params.p} onChange={handleChange} />
                        {errors.count && <div className="error">{errors.count}</div>}
                    </div>
                    <div>
                        <label>q (mayor que 1):</label>
                        <input type="number" name="q" value={params.q} onChange={handleChange} />
                        {errors.count && <div className="error">{errors.count}</div>}
                    </div>
                </>
            )}

            {(algorithm === 'congruencial_multiplicativo'  || algorithm === 'congruencial_mixto' )&& (
                <div>
                    <label>m (debe ser mayor que a) : </label>
                    <input type="number" name="m" value={params.m} onChange={handleChange} />
                    {errors.count && <div className="error">{errors.count}</div>}
                </div>
            )}
            <button type="submit">Generate Numbers</button>
        </form>
    );
};

export default AlgorithmForm;
