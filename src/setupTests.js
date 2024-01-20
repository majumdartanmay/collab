import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import crypto from 'crypto'

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: arr => crypto.randomBytes(arr.length),
  },
})
