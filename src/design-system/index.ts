/**
 * Design System — Main Index
 * Status: VISUAL BASELINE CANDIDATE — NOT GOVERNING — NOT YET APPROVED
 *
 * Single import point for all design system exports.
 * Usage: import { Button, Card, tokens } from '@/design-system';
 */

// Tokens
export * from './tokens';

// Primitives
export * from './primitives/Typography';

// Components
export * from './components/Button';
export * from './components/FormFields';
export * from './components/DataDisplay';
export * from './components/Overlays';

// Patterns
export * from './patterns';

// Shell (re-export from canonical location)
export * from './shell';

// Themes
export * from './themes';
