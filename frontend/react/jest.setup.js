import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill TextEncoder/TextDecoder for react-router-dom
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
