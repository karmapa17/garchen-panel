import {range} from 'ramda';

export default range(1, 8).map((num) => ({id: `sect-${num}`, value: num}));
