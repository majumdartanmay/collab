import * as collabUtils from '../utils/HookUtils'

export function navigationMocker(testNavigationValue) {

    const navigateMock = jest.spyOn(collabUtils, 'navigateHook');
    navigateMock.mockImplementation(() => {
        return (navigationPath) => {
            if (testNavigationValue)
                expect(navigationPath).toBe(testNavigationValue);
        }
    });

    return navigateMock;
}
