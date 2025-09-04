/**
 * Icons Test Suite
 * Tests for the unified icon system
 */

import { describe, test, expect } from '@jest/globals'
import { MapPin, Search, getIcon, iconMapping } from '../lib/icons-index'

describe('Icons System', () => {
  test('MapPin icon is properly exported', () => {
    expect(MapPin).toBeDefined()
    expect(typeof MapPin).toBe('object') // React components are objects
  })

  test('Search icon is properly exported', () => {
    expect(Search).toBeDefined()
    expect(typeof Search).toBe('object') // React components are objects
  })

  test('getIcon function works correctly', () => {
    const MapPinIcon = getIcon('mapPin')
    expect(MapPinIcon).toBeDefined()
    expect(typeof MapPinIcon).toBe('object') // React components are objects
  })

  test('iconMapping contains mapPin', () => {
    expect(iconMapping.mapPin).toBeDefined()
    expect(typeof iconMapping.mapPin).toBe('object') // React components are objects
  })

  test('iconMapping contains common icons', () => {
    expect(iconMapping.search).toBeDefined()
    expect(iconMapping.settings).toBeDefined()
    expect(iconMapping.user).toBeDefined()
    expect(iconMapping.bell).toBeDefined()
  })

  test('getIcon returns fallback for unknown icon', () => {
    const UnknownIcon = getIcon('unknown-icon-name')
    expect(UnknownIcon).toBeDefined()
    expect(typeof UnknownIcon).toBe('object') // React components are objects
  })

  test('all main icons are objects', () => {
    const mainIcons = ['settings', 'shield', 'database', 'bell', 'checkCircle', 'code', 'calendar', 'clock']

    mainIcons.forEach(iconName => {
      const icon = getIcon(iconName)
      expect(typeof icon).toBe('object') // React components are objects
      expect(icon).toBeDefined()
    })
  })
})
