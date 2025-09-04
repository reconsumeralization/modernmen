import pytest
import pdfplumber
from pdfplumber.display import PdfPlumberImageError

# Path to the OSS-Fuzz reproducer file.
# Assumes you have downloaded it and placed it in a 'data' subdirectory in your tests.
FUZZ_REPRODUCER_PATH = "tests/data/ossfuzz-4617042003296256.pdf"

def test_to_image_fuzz_reproducer_handles_exception():
    """
    Tests that the fix for OSS-Fuzz issue 421951265 correctly catches
    the low-level exception and raises a controlled PdfPlumberImageError.
    """
    try:
        with pdfplumber.open(FUZZ_REPRODUCER_PATH) as pdf:
            page = pdf.pages[0]
            # This call should fail, but with our controlled exception, not a raw crash.
            with pytest.raises(PdfPlumberImageError):
                _ = page.to_image()
    except FileNotFoundError:
        pytest.skip(f"Reproducer file not found at {FUZZ_REPRODUCER_PATH}")
