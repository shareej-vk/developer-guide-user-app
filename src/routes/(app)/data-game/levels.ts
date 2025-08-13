import type { Level } from './types';

export const levels: Level[] = [
  {
    id: 1,
    target: {
      name: 'Tom',
      age: 25,
      isHappy: true
    },
    initialCode: '{\n\n}',
    instructions: 'Create an object with name (string), age (number), and isHappy (boolean) properties.',
    hints: [
      'Use double quotes for string values like "Jay"',
      'Numbers don\'t need quotes',
      'Booleans are just true or false without quotes'
    ]
  },
  {
    id: 2,
    target: {
      name: 'Sam',
      age: 30,
      hairColor: 'brown',
      eyeColor: 'darkgreen',
      isHappy: true
    },
    initialCode: `{
  "name": "Tom",
  "age": 20,
  "isHappy": false
}`,
    instructions: 'Add hairColor and eyeColor properties with color values.',
    hints: [
      'Use simple color names in quotes, like "brown" or "blue"',
      'Make sure to spell the color names correctly',
      'Don\'t forget the commas between properties'
    ]
  },
  {
    id: 3,
    target: {
      name: 'Jay',
      age: 28,
      isHappy: true,
      hairColor: 'brown',
      eyeColor: 'green',
      skinColor: 'wheat',
      accessories: ['glasses', 'coat']
    },
    initialCode: `{
  "name": "Tom",
  "age": 20,
  "isHappy": false,  
  "hairColor": "brown",
  "eyeColor": "green"
}`,
    instructions: 'Jay needs help with accessories. Add an `accessories` array with two items: `"glasses"` and `"coat"`.',
    hints: [
      'Create an array with two string values inside, separated by a comma: `["item1", "item2"]`.',
      'Arrays in JSON are wrapped in square brackets [].',
      'Strings inside an array are separated by commas.',
      'Make sure your array contains the strings "glasses" and "watch".'
    ]
  },
  {
    id: 4,
    target: {
      name: 'Taylor',
      age: 27,
      isHappy: true,
      hairColor: 'black',
      eyeColor: 'brown',
      skinColor: 'wheat',
      accessories: ['glasses', 'coat'],
      pet: {
        type: 'dog',
        name: 'Buddy',
        color: 'gold'
      }
    },
    initialCode: `{
      "name": "Jay",
      "age": 28,
      "isHappy": true,
      "hairColor": "brown",
      "eyeColor": "green",
      "skinColor": "wheat",
      "accessories": ["glasses", "coat"]
    }`,
    'instructions': 'Taylor wants to adopt a pet! Add a `pet` property that is an object with `type`, `name`, and `color` properties.','hints': [
      'The pet should be an object with curly braces {}',
      'Each property in the object needs to be in quotes',
      'Don\'t forget the comma after the last property in the main object',
      'Example: "pet": { "type": "cat", "name": "Whiskers", "color": "gray" }'
    ]
  },
  {
    id: 5,
    target: {
      name: 'Taylor',
      age: 27,
      isHappy: true,
      hairColor: 'black',
      eyeColor: 'brown',
      skinColor: 'wheat',
      accessories: ['glasses', 'coat'],
      pets: [
        {
          type: 'dog',
          name: 'Buddy',
          color: 'goldenrod'
        },
        {
          type: 'cat',
          name: 'Whiskers',
          color: 'gray'
        },
        {
          type: 'pigeon',
          name: 'Sky',
          color: 'lightblue'
        }
      ]
    },
    initialCode: `
    {
      "name": "Taylor",
      "age": 27,
      "isHappy": true,
      "hairColor": "black",
      "eyeColor": "brown",
      "skinColor": "wheat",
      "accessories": ["glasses", "coat"],
      "pet": {
        "type": "dog",
        "name": "Buddy",
        "color": "gold"
      }
    }
    
    `,'instructions': 'Taylor loves animals! Add a `pets` array with three pet objects. Each pet should have `type`, `name`, and `color` properties. Include a dog, a cat, and a pigeon.','hints': [
      'The `pets` property should be an array of objects',
      'Each pet object needs curly braces {} and properties in quotes',
      'Example: `{ "type": "dog", "name": "Buddy", "color": "goldenrod" }`',
      'Don\'t forget to separate objects in the array with commas'
    ]
  }
];
