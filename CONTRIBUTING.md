# Contributing to Modern Men Salon Management System

First off, thank you for considering contributing to Modern Men! It's people like you that make this project better.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **System information** (OS, Node version, browser)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **Clear title and description**
- **Use case** - why is this needed?
- **Possible implementation**
- **Alternative solutions** you've considered

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code, add tests
3. If you've changed APIs, update documentation
4. Ensure the test suite passes
5. Make sure your code follows the existing style
6. Issue that pull request!

## Development Setup

1. Fork and clone the repo
   ```bash
   git clone https://github.com/your-username/modernmen.git
   cd modernmen
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up your environment
   ```bash
   cp .env.example .env.local
   # Configure your local database
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

## Style Guide

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow existing code style
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### React/Next.js
- Use functional components with hooks
- Keep components small and reusable
- Use proper TypeScript types for props
- Follow Next.js best practices

### Git Commit Messages
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests

Example:
```
Add real-time availability checking to booking form

- Implement availability API endpoint
- Add calendar component with time slots
- Update booking form to use new component

Fixes #123
```

### Testing
- Write tests for new features
- Update tests when changing functionality
- Ensure all tests pass before submitting PR
- Aim for good test coverage

## Project Structure

```
modernmen/
├── app/           # Next.js app directory
├── components/    # Reusable components
├── lib/          # Utility functions
├── prisma/       # Database schema
└── public/       # Static assets
```

## Need Help?

- Check the [documentation](./README.md)
- Look through [existing issues](https://github.com/reconsumeralization/modernmen/issues)
- Ask in discussions
- Contact the maintainers

## Recognition

Contributors will be recognized in:
- The README file
- Release notes
- Project documentation

Thank you for contributing to Modern Men! 🎉