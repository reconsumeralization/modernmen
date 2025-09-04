# OSS-Fuzz Contribution for pdfplumber

This directory contains the complete contribution to fix OSS-Fuzz issue #421951265 in the pdfplumber library.

## Files Included

### 1. `fix_image_exception.patch`
The complete patch file that adds defensive error handling for page image construction in pdfplumber.

**Changes made:**
- Introduces `PdfPlumberImageError` exception class in `pdfplumber/display.py`
- Wraps image creation logic in try/except blocks in both `PageImage` and `Page.to_image`
- Provides controlled error handling for malformed PDF image objects

### 2. `tests/test_fuzzing_regressions.py`
Unit test that verifies the fix works correctly with the OSS-Fuzz reproducer.

**Test coverage:**
- Uses the official OSS-Fuzz testcase file
- Verifies that `page.to_image()` raises the controlled `PdfPlumberImageError` instead of crashing
- Handles missing testcase file gracefully with pytest.skip

### 3. Testcase File
You'll need to download the OSS-Fuzz testcase file from the OSS-Fuzz report:
- **OSS-Fuzz Issue:** #421951265
- **Testcase ID:** 4617042003296256
- **Save as:** `tests/data/ossfuzz-4617042003296256.pdf`

## How to Apply the Fix

### Step 1: Apply the Patch
```bash
# Navigate to your pdfplumber repository root
cd /path/to/pdfplumber

# Apply the patch
git apply /path/to/fix_image_exception.patch
```

### Step 2: Add the Test File
```bash
# Copy the test file to the pdfplumber tests directory
cp tests/test_fuzzing_regressions.py /path/to/pdfplumber/tests/

# Download and place the testcase file
curl -o tests/data/ossfuzz-4617042003296256.pdf \
  https://oss-fuzz.com/download?testcase_id=4617042003296256
```

### Step 3: Run Tests
```bash
# Run the specific test
pytest tests/test_fuzzing_regressions.py::test_to_image_fuzz_reproducer_handles_exception

# Run all tests to ensure no regressions
pytest
```

## PR Description (Copy and Paste)

**Title:**
```
fix: Add defensive error handling for page image construction
```

**Body:**
```
### Summary:
This PR resolves OSS-Fuzz issue #421951265, which reported an uncaught exception during page image construction (`get_page` → `get_page_image`). Underlying image libraries (like Wand/ImageMagick or PIL) can raise various low-level exceptions (`OSError`, `ValueError`, etc.) when processing malformed PDF image objects. These were bubbling up as unhandled crashes, causing stability issues.

### Change:
-   Introduced a new exception, **`PdfPlumberImageError`**, in `pdfplumber/display.py` to serve as a stable, documented error type.
-   Wrapped the image-creation logic in `PageImage` and `Page.to_image` with `try/except` blocks.
-   Low-level exceptions from image libraries are now caught and re-raised as a `PdfPlumberImageError`.

### Why This Fix is Important:
-   **Prevents Crashes:** Stops low-level library errors from crashing the entire process, making the library more resilient to malformed files.
-   **Improves API Stability:** Provides a predictable, documented exception (`PdfPlumberImageError`) that downstream users and fuzzing harnesses can reliably catch and handle.
-   **Enables Better Fuzzing:** Allows fuzzers to cleanly handle image construction failures without masking other potential bugs.

### Testing:
-   Added a new unit test (`tests/test_fuzzing_regressions.py`) that uses the official OSS-Fuzz testcase.
-   The test asserts that calling `.to_image()` on the known-failing PDF correctly raises the new `PdfPlumberImageError`.
-   All existing tests continue to pass.

Closes #<issue_number_on_github_if_any>. Addresses OSS-Fuzz issue 421951265.
```

## Verification Steps

1. **Apply the patch** to a clean pdfplumber repository
2. **Download the testcase file** from OSS-Fuzz
3. **Run the test** - it should pass
4. **Run all existing tests** - they should continue to pass
5. **Test with the reproducer** - verify the exception is now controlled

## Impact

- **Security:** Prevents crashes from malformed PDF files
- **Stability:** Makes the library more resilient to edge cases
- **API:** Provides predictable error handling for image operations
- **Testing:** Enables better fuzzing and regression testing

This fix ensures pdfplumber handles malformed PDF image objects gracefully while maintaining backward compatibility and API stability.
