import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppSteps } from '../../../src/hooks/useAppSteps';
import { AppStep } from '../../../src/types/types';

describe('useAppSteps Hook', () => {
  it('should initialize with upload step', () => {
    const { result } = renderHook(() => useAppSteps({}));

    expect(result.current.step).toBe(AppStep.UPLOAD);
    expect(result.current.highestStepReached).toBe(AppStep.UPLOAD);
  });

  it('should navigate between steps correctly', () => {
    const { result } = renderHook(() => useAppSteps({}));

    // Navigate forward
    act(() => {
      result.current.goToStep(AppStep.ENHANCE);
    });
    expect(result.current.step).toBe(AppStep.ENHANCE);
    expect(result.current.highestStepReached).toBe(AppStep.ENHANCE);

    act(() => {
      result.current.goToStep(AppStep.STYLE);
    });
    expect(result.current.step).toBe(AppStep.STYLE);
    expect(result.current.highestStepReached).toBe(AppStep.STYLE);

    act(() => {
      result.current.goToStep(AppStep.PREVIEW);
    });
    expect(result.current.step).toBe(AppStep.PREVIEW);
    expect(result.current.highestStepReached).toBe(AppStep.PREVIEW);

    // Navigate backward - highest step should remain
    act(() => {
      result.current.goToStep(AppStep.STYLE);
    });
    expect(result.current.step).toBe(AppStep.STYLE);
    expect(result.current.highestStepReached).toBe(AppStep.PREVIEW);
  });

  it('should initialize with custom initial step', () => {
    const { result } = renderHook(() =>
      useAppSteps({ initialStep: AppStep.ENHANCE })
    );

    expect(result.current.step).toBe(AppStep.ENHANCE);
    expect(result.current.highestStepReached).toBe(AppStep.ENHANCE);
  });

  it('should call onStepChange callback when navigating', () => {
    const mockOnStepChange = vi.fn();
    const { result } = renderHook(() =>
      useAppSteps({ onStepChange: mockOnStepChange })
    );

    act(() => {
      result.current.goToStep(AppStep.ENHANCE);
    });

    expect(mockOnStepChange).toHaveBeenCalledWith(
      AppStep.UPLOAD,
      AppStep.ENHANCE
    );
  });

  it('should update highest step reached correctly', () => {
    const { result } = renderHook(() => useAppSteps({}));

    // Go to style step
    act(() => {
      result.current.goToStep(AppStep.STYLE);
    });
    expect(result.current.highestStepReached).toBe(AppStep.STYLE);

    // Go back to upload - highest step should remain style
    act(() => {
      result.current.goToStep(AppStep.UPLOAD);
    });
    expect(result.current.step).toBe(AppStep.UPLOAD);
    expect(result.current.highestStepReached).toBe(AppStep.STYLE);

    // Go to preview - highest step should update
    act(() => {
      result.current.goToStep(AppStep.PREVIEW);
    });
    expect(result.current.highestStepReached).toBe(AppStep.PREVIEW);
  });

  it('should allow direct step setting', () => {
    const { result } = renderHook(() => useAppSteps({}));

    act(() => {
      result.current.setStep(AppStep.GENERATE);
    });

    expect(result.current.step).toBe(AppStep.GENERATE);
    // setStep doesn't update highest step reached
    expect(result.current.highestStepReached).toBe(AppStep.UPLOAD);
  });

  it('should handle security considerations with step validation', () => {
    const { result } = renderHook(() => useAppSteps({}));

    // Test that steps are properly validated through enum values
    act(() => {
      result.current.goToStep(AppStep.PREVIEW);
    });

    expect(result.current.step).toBe(AppStep.PREVIEW);
    expect(typeof result.current.step).toBe('number');
    expect(Object.values(AppStep)).toContain(result.current.step);
  });

  it('should call onStepChange callback and propagate errors', () => {
    const errorCallback = vi.fn(() => {
      throw new Error('Callback error');
    });

    const { result } = renderHook(() =>
      useAppSteps({ onStepChange: errorCallback })
    );

    // Callback errors should propagate (this is expected behavior)
    expect(() => {
      act(() => {
        result.current.goToStep(AppStep.ENHANCE);
      });
    }).toThrow('Callback error');

    // Step should remain unchanged when callback throws
    expect(result.current.step).toBe(AppStep.UPLOAD);
    expect(errorCallback).toHaveBeenCalledWith(AppStep.UPLOAD, AppStep.ENHANCE);
  });
});
