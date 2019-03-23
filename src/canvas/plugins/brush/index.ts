// export interface SimpleBrush
export enum HighlightBrusheTypes {
    NONE = 'none',
    SIMPLE_CHAR = 'simple-char',
    SIMPLE_WORD = 'simple-word',
    UNICODE = 'unicode',
    UNDERSCORE = 'underscore',
    DOT = 'dot',
    PREFIX = 'prefix'
}

export * from './simpleBrush';
export * from './underscoreBrush';
export * from './unicodeBrush';
export * from './dotBrush';
export * from './morphemeBrush';
