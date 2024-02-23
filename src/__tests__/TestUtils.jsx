import * as hookUtils from '../utils/HookUtils'

/**
 * Mocks the useNavigate hook
 *
 * @param {string} testNavigationValue - path to navigtate to
 * @param {@function} callback - Helps to brodcast that the action is complete
 * @returns {@function} jest mock function
 */
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

/**
 * Mockes the cookie hook
 *
 * @param {string} param - Cookie identifier
 * @returns {@function} Mock of the cookie hook
 */
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
