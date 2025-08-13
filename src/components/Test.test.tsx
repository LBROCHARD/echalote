import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Test from './Test';


const mocks = vi.hoisted(() => ({
        mockUseGroupContext: vi.fn(),
        // () => ({
        //     selectedPage: { 
        //         id: "1",
        //         pageName: 'Test Page',
        //         pageColor: 'FF0000',
        //         tags: 'tag1 tag2',
        //         content: '#Content \n Initial page content, written in **Markdown**',
        //     }
        // }),
}))

vi.mock('@/providers/GroupContext', () => ({
    useGroupContext: mocks.mockUseGroupContext,
}));

// fonctionnel
// vi.mock('@/providers/GroupContext', () => ({
//     useGroupContext: () => ({
//         selectedPage: { 
//             id: "1",
//             pageName: 'Test Page',
//             pageColor: 'FF0000',
//             tags: 'tag1 tag2',
//             content: '#Content \n Initial page content, written in **Markdown**',
//         }
//     }),
// }));


describe("Test", () => {

    const mockedPage = {
        id: "1",
        pageName: 'Test Page',
        pageColor: 'FF0000',
        tags: 'tag1 tag2',
        content: '#Content \n Initial page content, written in **Markdown**',
    };

    beforeEach(() => {
        // mockSelectedPage.mockReturnValue(mockedPage)
        // mockedUseGroupContext.mockReturnValue({
        //     selectedPage: vi.fn().mockReturnValue(mockedPage),
        // });
        // mocks.mockUseGroupContext.mockReset();
    });

    it("Should work MDRRR", async () => {

        mocks.mockUseGroupContext.mockImplementation(() => ({
            selectedPage: mockedPage
        }))

        render(
            <Test/>
        );

        expect(screen.getByText('Test Page')).toBeInTheDocument();
    });

});

