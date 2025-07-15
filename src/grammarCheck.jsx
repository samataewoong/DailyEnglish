import React, {useState} from 'react';
import axios from 'axios';

export async function grammarCheck(myEng) {
    if(!myEng.trim()) {
        throw new Error('당신의 번역을 입력하세요.');
    }

    try {
        const response = await axios.post('http://localhost:4000/check-grammar/grammar-check', {
            text: myEng,
        });
        return response.data;
    } catch (error) {
        console.error('문법 검사 중 오류:', error);
        throw new Error('문법 검사 중 오류가 발생했습니다.');
    }
}