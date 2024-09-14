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
        switch (name) {
            case 'seed':
                switch (algorithm) {
                    case 'mersenne_twister':
                        if (intValue < 0 || intValue > 4294967295) {
                            error = 'La semilla debe ser un entero de 32 bits (0 a 4294967295).';
                        }
                        break;
                    case 'blum_blum_shub':
                        if (intValue <= 1 || intValue >= (params.p * params.q)) {
                            error = 'La semilla debe ser mayor que 1 y menor que p * q.';
                        }
                        break;
                    case 'congruencial_mixto':
                    case 'congruencial_multiplicativo':
                        if (intValue <= 1 || intValue >= params.m) {
                            error = 'La semilla debe ser mayor que 1 y menor que m.';
                        }
                        break;
                    case 'XOR_Shift':
                        if (intValue < 1 || intValue > 4294967295) {
                            error = 'La semilla debe ser un entero de 32 bits positivo (1 a 4294967295).';
                        }
                        break;
                    default:
                        break;
                }
                break;
            case 'p':
            case 'q':
                if (intValue <= 1) {
                    error = 'p y q deben ser mayores que 1.';
                }
                if (name === 'q' && intValue === parseInt(params.p, 10)) {
                    error = 'p y q deben ser distintos entre sí.';
                }
                break;
            case 'a':
                if (intValue <= 1) {
                    error = 'a debe ser mayor que 1.';
                }
                break;
            case 'c':
                if (intValue <= 1) {
                    error = 'c debe ser mayor que 1.';
                }
                break;
            case 'm':
                if (algorithm === 'congruencial_mixto' && intValue <= Math.max(parseInt(params.a, 10), parseInt(params.c, 10))) {
                    error = 'm debe ser mayor que a y c.';
                } else if (algorithm === 'congruencial_multiplicativo' && intValue <= parseInt(params.a, 10)) {
                    error = 'm debe ser mayor que a.';
                }
                break;
            case 'b':
                if (intValue <= 1) {
                    error = 'b debe ser mayor que 1.';
                }
                break;
            default:
                break;
        }

        setErrors(prev => ({ ...prev, [name]: error }));
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setParams(prev => ({ ...prev, [name]: value }));
        validate(name, value);
        setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!algorithm) {
            alert('Por favor selecciona un algoritmo.');
            return;
        }

        setErrors({});

        let formIsValid = true;
        Object.keys(params).forEach(key => {
            validate(key, params[key]);
            if (errors[key])
                {
                    formIsValid = false;
                    alert(errors[key]);
                } 
        });

        if (formIsValid) {
            onGenerate(algorithm, count, params);
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

        useEffect(() => {
            switch (algorithm) {
                case 'XOR_Shift':
                    setParams(prev => ({ ...prev, a: '13', b: '17', c: '5' }));
                    break;
                case 'mersenne_twister':
                    setParams(prev => ({ ...prev, seed: '789' }));
                    break;
                case 'blum_blum_shub':
                    setParams(prev => ({ ...prev, p: '14879', q: '19867' }));
                    break;
            }
        }, [algorithm]);

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
                <label>Count:</label>
                <input type="number" value={count} onChange={(e) => setCount(e.target.value)} />
                {errors.count && <div className="error">{errors.count}</div>}
            </div>

            {algorithm && (
                <div>
                    <label>Seed:</label>
                    <input type="number" name="seed" value={params.seed} onChange={handleChange} />
                    {errors.count && <div className="error">{errors.count}</div>}
                </div>
            )}

            {(algorithm === 'XOR_Shift' || algorithm === 'congruencial_mixto' || algorithm === 'congruencial_multiplicativo') && (
                <>
                    <div>
                        <label>a:</label>
                        <input type="number" name="a" value={params.a} onChange={handleChange} />
                        {errors.count && <div className="error">{errors.count}</div>}
                    </div>

                    {(algorithm === 'XOR_Shift' || algorithm === 'congruencial_mixto') && (
                        <div>
                            <label>c:</label>
                            <input type="number" name="c" value={params.c} onChange={handleChange} />
                            {errors.count && <div className="error">{errors.count}</div>}
                        </div>
                    )}
                </>
            )}

            {algorithm === 'XOR_Shift' && (
                <div>
                    <label>b:</label>
                    <input type="number" name="b" value={params.b} onChange={handleChange} />
                    {errors.count && <div className="error">{errors.count}</div>}
                </div>
            )}

            {algorithm === 'blum_blum_shub' && (
                <>
                    <div>
                        <label>p:</label>
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
                    <label>m: </label>
                    <input type="number" name="m" value={params.m} onChange={handleChange} />
                    {errors.count && <div className="error">{errors.count}</div>}
                </div>
            )}
            <button type="submit">Generate Numbers</button>
        </form>
    );
};

export default AlgorithmForm;
