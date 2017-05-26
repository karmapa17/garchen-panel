import {range} from 'ramda';

export default range(1, 13).map((num) => ({id: `explanation-category-${num}`, value: num}));
