import React, { useState } from 'react';
const AlgorithmForm = ({ onGenerate }) => {
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

    const handleChange = (e) => {
        setParams({
            ...params,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onGenerate(algorithm, count, params);
    };


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
            </div>

            {algorithm && (
                <div>
                    <label>Seed:</label>
                    <input type="number" name="seed" value={params.seed} onChange={handleChange} />
                </div>
            )}

            {(algorithm === 'XOR_Shift' || algorithm === 'congruencial_mixto' || algorithm === 'congruencial_multiplicativo') && (
                <>
                    <div>
                        <label>a:</label>
                        <input type="number" name="a" value={params.a} onChange={handleChange} />
                    </div>
                    {(algorithm === 'XOR_Shift' || algorithm === 'congruencial_mixto') && (
                        <div>
                            <label>c:</label>
                            <input type="number" name="c" value={params.c} onChange={handleChange} />
                        </div>
                    )}
                </>
            )}

            {algorithm === 'XOR_Shift' && (
                <div>
                    <label>b:</label>
                    <input type="number" name="b" value={params.b} onChange={handleChange} />
                </div>
            )}

            {algorithm === 'blum_blum_shub' && (
                <>
                    <div>
                        <label>p:</label>
                        <input type="number" name="p" value={params.p} onChange={handleChange} />
                    </div>
                    <div>
                        <label>q:</label>
                        <input type="number" name="q" value={params.q} onChange={handleChange} />
                    </div>
                </>
            )}

            {algorithm === 'congruencial_multiplicativo' && (
                <div>
                    <label>m:</label>
                    <input type="number" name="m" value={params.m} onChange={handleChange} />
                </div>
            )}

            <button type="submit">Generate Numbers</button>
        </form>
    );
};

export default AlgorithmForm;
