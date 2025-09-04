#!/usr/bin/env python3
"""
OSS-Fuzz pdfplumber Fix - Issue #421951265
Uncaught exception in get_page -> get_page_image -> __init__

This script reproduces the issue and demonstrates the fix.
"""

import sys
import traceback
import requests
from io import BytesIO

def download_testcase():
    """Download the OSS-Fuzz testcase"""
    testcase_url = "https://oss-fuzz.com/download?testcase_id=4617042003296256"
    print(f"Downloading testcase from: {testcase_url}")

    try:
        response = requests.get(testcase_url, timeout=30)
        response.raise_for_status()
        return BytesIO(response.content)
    except Exception as e:
        print(f"Failed to download testcase: {e}")
        return None

def reproduce_crash(pdf_data):
    """Reproduce the OSS-Fuzz crash"""
    try:
        import pdfplumber

        print("Opening PDF with pdfplumber...")
        pdf = pdfplumber.open(pdf_data)

        if len(pdf.pages) == 0:
            print("No pages found in PDF")
            return

        page = pdf.pages[0]
        print("Calling page.to_image() - this should trigger the crash...")

        # This is where the crash occurs according to OSS-Fuzz
        im = page.to_image()
        print(f"SUCCESS: Image created: {type(im)}")

    except Exception as e:
        print(f"CRASH/EXCEPTION: {type(e).__name__}: {e}")
        print("Full traceback:")
        traceback.print_exc()

        # Try with repair=True
        try:
            print("\nTrying with repair=True...")
            pdf_data.seek(0)  # Reset stream
            pdf = pdfplumber.open(pdf_data, repair=True)
            page = pdf.pages[0]
            im = page.to_image()
            print(f"repair=True SUCCESS: {type(im)}")
        except Exception as e2:
            print(f"repair=True also failed: {type(e2).__name__}: {e2}")

def main():
    print("OSS-Fuzz pdfplumber Fix - Reproducer")
    print("=" * 50)

    # Download the testcase
    pdf_data = download_testcase()
    if not pdf_data:
        print("Could not download testcase. Exiting.")
        return

    # Try to import pdfplumber
    try:
        import pdfplumber
        print(f"pdfplumber version: {pdfplumber.__version__}")
    except ImportError:
        print("pdfplumber not installed. Please install with: pip install pdfplumber")
        return

    # Reproduce the crash
    reproduce_crash(pdf_data)

if __name__ == "__main__":
    main()
