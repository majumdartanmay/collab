import * as hookUtils from '../utils/HookUtils'

export function navigationMocker(testNavigationValue, callback) {

    const navigateMock = jest.spyOn(hookUtils, 'navigateHook');
    navigateMock.mockImplementation(() => {
        return (navigationPath) => {
            if (testNavigationValue)
                expect(navigationPath).toBe(testNavigationValue);
            if (callback) {
                callback();
            }
        }
    });

    return navigateMock;
}

export function cookieMocker(param) {
    const cookieMock = jest.spyOn(hookUtils, 'cookiesHook');
    cookieMock.mockImplementation((_) => {
        return [
            param,
            {}
        ]
    }); 
    return cookieMock;
} 
