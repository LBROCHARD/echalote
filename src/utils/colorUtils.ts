export const getLuminosity = (hex: string): number => {
    var substrings: number[] = [0, 2, 4, 6];
    
    if (hex.length == 6) {
        substrings = [0, 2, 4, 6];
    } else if (hex.length == 7) {
        substrings = [1, 3, 5, 7];
    } else {
        throw Error;
    }

    const r = parseInt(hex.substring(substrings[0], substrings[1]), 16);
    const g = parseInt(hex.substring(substrings[1], substrings[2]), 16);
    const b = parseInt(hex.substring(substrings[2], substrings[3]), 16);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const isColorDark = (hex: string): boolean => {
    return getLuminosity(hex) < 128;
};