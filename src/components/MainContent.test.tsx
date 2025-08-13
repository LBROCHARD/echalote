import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MainContent from './MainContent';
import userEvent from '@testing-library/user-event';
import AuthProvider from '@/providers/AuthContext';


const mocks = vi.hoisted(() => ({
    mockUseGroupContext: vi.fn(),
    mockUseAuth: vi.fn(),
}));

const mockUseNavigate = vi.fn();
const mockFetch = vi.fn();


vi.mock('./ModifyPageDialog', () => ({
    default: () => <div data-testid="modify-dialog">ModifyPageDialog</div>,
}));

vi.mock('./SaveButton', () => ({
    default: () => <button data-testid="save-button">Save</button>,
}));

vi.mock('./EditBtnContent', () => ({
    default: () => <span data-testid="edit-btn-content">Edit</span>,
}));

vi.mock('react-router-dom', () => ({
    useNavigate: () => mockUseNavigate,
}));

vi.mock('@/providers/GroupContext', () => ({
    useGroupContext: mocks.mockUseGroupContext,
}));

global.fetch = mockFetch;


describe('MainContent', () => {
    
    const mockedPage = {
        id: "1",
        pageName: 'Test Page',
        pageColor: 'FF0000',
        tags: 'tag1 tag2',
        content: 'Initial page content, written in **Markdown**',
    };

    const mockedGroup = { id: '1', groupName: 'Test Group' };

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseNavigate.mockReturnValue(vi.fn())
        mocks.mockUseGroupContext.mockImplementation(() => ({
            selectedPage: mockedPage,
            selectedGroup: mockedGroup
        }))
    });


    it('should correctly show the page name and tags', async () => {
        render(
            <AuthProvider>
                <MainContent/>
            </AuthProvider>
        );
        
        expect(screen.getByText('Test Page')).toBeInTheDocument();
        expect(screen.getByText('#tag1')).toBeInTheDocument();
        expect(screen.getByText('#tag2')).toBeInTheDocument();
    });

    it('should show the Reading elements at the start', () => {
        render(
            <AuthProvider>
                <MainContent/>
            </AuthProvider>
        );

        const editModeButton = screen.getByTestId('editModeButton').parentElement;
        expect(editModeButton).toBeInTheDocument();
        expect(editModeButton).toHaveTextContent("Edit mode");
        
        const markdownDiv = screen.getByTestId('markdownDiv').parentElement;
        expect(markdownDiv).not.toHaveAttribute('hidden');

        // Search a button element with name containing Save Modifications
        const saveButton = screen.queryByRole('button', { name: /Save Modifications/i });
        expect(saveButton).toBeNull();

        const textarea = screen.getByTestId('editContentTextArea');
        expect(textarea).toHaveAttribute('hidden');
    });

    it('should show the Edit elements after clicking the Edit Button', async () => {
        render(
            <AuthProvider>
                <MainContent/>
            </AuthProvider>
        );
        
        const editButton = screen.getByRole('button', { name: /Edit mode/i });
        // Click on the EditMode Button
        await userEvent.click(editButton);

        expect(screen.getByRole('button', { name: /Reading mode/i })).toBeInTheDocument();

        const textarea = screen.getByTestId('editContentTextArea');
        expect(textarea).not.toHaveAttribute('hidden');

        const markdownDiv = screen.getByTestId('markdownDiv');
        expect(markdownDiv).toHaveAttribute('hidden');
    });

    it('should show the Save Button when the TextArea content is modified', async () => {
        render(
            <AuthProvider>
                <MainContent/>
            </AuthProvider>
        );

        const editButton = screen.getByRole('button', { name: /Edit mode/i });
        // Click on the EditMode Button
        await userEvent.click(editButton);

        const textarea = screen.getByTestId('editContentTextArea');
        // Change the content of the textArea
        await userEvent.type(textarea, 'New Content !');

        const saveButton = screen.getByRole('button', { name: /Save Modifications/i });
        expect(saveButton).toBeInTheDocument();
        expect(saveButton).toBeVisible();
    });

    it('should hide the Save Button and call updatePageContent after a click', async () => {

        // Mock fetch response
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ status: 'success' }),
        });

        // mocks.mockUseAuth.mockReturnValue({ token: 'mock-token' });

        render(
            <AuthProvider>
                <MainContent/>
            </AuthProvider>
        );
        
        
        const editButton = screen.getByRole('button', { name: /Edit mode/i });
        // Click on the EditMode Button
        await userEvent.click(editButton);
        const textarea = screen.getByTestId('editContentTextArea');
        // Change the content of the textArea
        await userEvent.type(textarea, 'New Content !');

        const saveButton = screen.getByRole('button', { name: /Save Modifications/i });
        // Click the Save button
        await userEvent.click(saveButton);

        // Check if fetch was called with the good content (meaning that the content will be saved)
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/pages/content"), {
            method: "put",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer null'
            },
            body: JSON.stringify({
                groupId: mockedGroup.id,
                pageId: mockedPage.id,
                pageContent: "Initial page content, written in **Markdown**New Content !",
            })
        });

        // Wait for update and for the Save button to diseapear
        await waitFor(() => {
            expect(screen.queryByRole('button', { name: /Save Modifications/i })).not.toBeInTheDocument();
        });
    });

    it('should transform the # into titles', async () => {
        const newMDContent = '# Title 1 \n ## Title 2 \n ### Title 3 ';

        // Set the content to directly be newMDContent
        mocks.mockUseGroupContext.mockImplementation(() => ({
            selectedPage: { ...mockedPage, content: newMDContent },
            selectedGroup: mockedGroup
        }))
        
        render(
            <AuthProvider>
                <MainContent/>
            </AuthProvider>
        );

        // Check if the correct titles are present in the markdownDiv
        const markdownContent = screen.getByTestId('markdownDiv');
        expect(markdownContent).toContainHTML('<h1>Title 1</h1>');
        expect(markdownContent).toContainHTML('<h2>Title 2</h2>');
        expect(markdownContent).toContainHTML('<h3>Title 3</h3>');
    });

    it('should transform text into paragraphes', async () => {
        const newMDContent = 'a first p \n a second p';
        
        mocks.mockUseGroupContext.mockImplementation(() => ({
            selectedPage: { ...mockedPage, content: newMDContent },
            selectedGroup: mockedGroup
        }))
        
        render(
            <AuthProvider>
                <MainContent/>
            </AuthProvider>
        );

        const markdownContent = screen.getByTestId('markdownDiv');
        expect(markdownContent).toContainHTML('<p>a first p</p>');
        expect(markdownContent).toContainHTML('<p>a second p</p>');
    });

    it('should transform dash into lists', async () => {
        const newMDContent = '- first element \n- second element';
        
        mocks.mockUseGroupContext.mockImplementation(() => ({
            selectedPage: { ...mockedPage, content: newMDContent },
            selectedGroup: mockedGroup
        }))
        
        render(
            <AuthProvider>
                <MainContent/>
            </AuthProvider>
        );

        const markdownContent = screen.getByTestId('markdownDiv');

        // This is to remove the tabs and back to line to have the whole thing on a single line
        const normalizedHtml = markdownContent.innerHTML.replace(/\s/g, '');
        const expectedHtml = '<ul><li><p>first element</p></li><li><p>second element</p></li></ul>'.replace(/\s/g, '');

        expect(normalizedHtml).toContain(expectedHtml);

    });

    it('should transform * into italic or bold', async () => {
        const newMDContent = 'some *cool* or **really cool** text';
        
        mocks.mockUseGroupContext.mockImplementation(() => ({
            selectedPage: { ...mockedPage, content: newMDContent },
            selectedGroup: mockedGroup
        }))
        
        render(
            <AuthProvider>
                <MainContent/>
            </AuthProvider>
        );

        const markdownContent = screen.getByTestId('markdownDiv');
        expect(markdownContent).toContainHTML('<strong>really cool</strong>');
        expect(markdownContent).toContainHTML('<em>cool</em>');
    });

    it('should transform link into <a>', async () => {
        const newMDContent = 'here is a [link](https://www.example.com)';
        
        mocks.mockUseGroupContext.mockImplementation(() => ({
            selectedPage: { ...mockedPage, content: newMDContent },
            selectedGroup: mockedGroup
        }))
        
        render(
            <AuthProvider>
                <MainContent/>
            </AuthProvider>
        );

        const markdownContent = screen.getByTestId('markdownDiv');
        expect(markdownContent).toContainHTML('<a href="https://www.example.com">link</a>');
    });
});
