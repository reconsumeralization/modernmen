#!/bin/bash

# OSS-Fuzz Contribution Verification Script
# This script helps verify that the pdfplumber fix is properly set up

echo "🔍 OSS-Fuzz Contribution Verification"
echo "===================================="

# Check if files exist
echo ""
echo "📁 Checking file structure..."
files=(
    "fix_image_exception.patch"
    "tests/test_fuzzing_regressions.py"
    "OSS-FUZZ-CONTRIBUTION-README.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file - Found"
    else
        echo "❌ $file - Missing"
    fi
done

# Check if tests directory exists
if [ -d "tests" ]; then
    echo "✅ tests/ directory - Found"
    if [ -d "tests/data" ]; then
        echo "✅ tests/data/ directory - Found"
    else
        echo "⚠️  tests/data/ directory - Missing (create with: mkdir -p tests/data)"
    fi
else
    echo "❌ tests/ directory - Missing (create with: mkdir -p tests)"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Download the OSS-Fuzz testcase file:"
echo "   curl -o tests/data/ossfuzz-4617042003296256.pdf \\"
echo "     https://oss-fuzz.com/download?testcase_id=4617042003296256"
echo ""
echo "2. Copy files to pdfplumber repository:"
echo "   cp fix_image_exception.patch /path/to/pdfplumber/"
echo "   cp tests/test_fuzzing_regressions.py /path/to/pdfplumber/tests/"
echo "   cp tests/data/ossfuzz-4617042003296256.pdf /path/to/pdfplumber/tests/data/"
echo ""
echo "3. Apply the patch:"
echo "   cd /path/to/pdfplumber && git apply fix_image_exception.patch"
echo ""
echo "4. Run tests:"
echo "   pytest tests/test_fuzzing_regressions.py"
echo ""
echo "📖 For detailed instructions, see: OSS-FUZZ-CONTRIBUTION-README.md"
