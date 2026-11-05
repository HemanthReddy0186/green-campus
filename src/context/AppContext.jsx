import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  INITIAL_USER,
  INITIAL_AUDIT_HISTORY,
  INITIAL_LEADERBOARD,
  INITIAL_CHALLENGES,
  INITIAL_EVENT_AUDITS,
  INITIAL_CHALLENGE_LOGS,
  BADGES_LIST,
  DEPARTMENTS,
} from '../data/initialData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Load state from localStorage or use initial defaults
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('gc_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [currentView, setCurrentView] = useState(() => {
    // If user has saved session, default to dashboard, otherwise landing
    const savedView = localStorage.getItem('gc_current_view');
    return savedView || 'landing';
  });

  // Breadcrumbs history or active module context
  const [wizardDraft, setWizardDraft] = useState(null);

  const [auditHistory, setAuditHistory] = useState(() => {
    const saved = localStorage.getItem('gc_audits');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_HISTORY;
  });

  const [leaderboard, setLeaderboard] = useState(() => {
    try {
      const saved = localStorage.getItem('gc_leaderboard');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((d) => ({
            ...d,
            code: d.code || d.deptId || 'DEPT',
            points: Number(d.points) || 0,
            co2OffsetKg: Number(d.co2OffsetKg) || 0,
            students:
              d.students !== undefined && d.students !== null && !isNaN(Number(d.students)) && Number(d.students) >= 0
                ? Number(d.students)
                : 0,
            perCapitaPoints:
              (Number(d.students) || 0) > 0
                ? Math.round(((Number(d.points) || 0) / Number(d.students)) * 10) / 10
                : (Number(d.points) || 0) > 0
                ? 'N/A'
                : 0,
          }));
        }
      }
    } catch {
      // Fallback on parse failure
    }
    return INITIAL_LEADERBOARD;
  });

  const [eventAudits, setEventAudits] = useState(() => {
    const saved = localStorage.getItem('gc_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENT_AUDITS;
  });

  const [challengeLogs, setChallengeLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('gc_challenge_logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_CHALLENGE_LOGS;
  });

  const [completedChallengeIds, setCompletedChallengeIds] = useState(() => {
    const saved = localStorage.getItem('gc_completed_challenges');
    return saved ? JSON.parse(saved) : ['ch-commute-clean', 'ch-zero-plastic-bottle'];
  });

  const [toast, setToast] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('gc_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('gc_current_view', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('gc_audits', JSON.stringify(auditHistory));
  }, [auditHistory]);

  useEffect(() => {
    localStorage.setItem('gc_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  useEffect(() => {
    localStorage.setItem('gc_events', JSON.stringify(eventAudits));
  }, [eventAudits]);

  useEffect(() => {
    localStorage.setItem('gc_completed_challenges', JSON.stringify(completedChallengeIds));
  }, [completedChallengeIds]);

  useEffect(() => {
    localStorage.setItem('gc_challenge_logs', JSON.stringify(challengeLogs));
  }, [challengeLogs]);

  // Toast auto-clear
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#059669', '#34d399', '#f59e0b', '#6366f1'],
      });
    } catch {
      // safe fallback
    }
  };

  // Add a new audit
  const addAudit = (newAudit) => {
    const auditRecord = {
      id: `aud-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Verified',
      isInitial: false,
      ...newAudit,
    };

    setAuditHistory((prev) => [auditRecord, ...prev]);

    // Reward points for completing an audit (+50 pts)
    const pointsToAdd = newAudit.pointsEarned || 50;
    const co2Saved = Math.max(0, Math.round((165 - newAudit.totalMonthlyKg) * 10) / 10);

    updateUserPoints(pointsToAdd, co2Saved);

    // Update department points on leaderboard
    updateDepartmentPoints(currentUser.department, pointsToAdd, co2Saved);

    triggerConfetti();
    showToast(`Audit saved! +${pointsToAdd} Eco Points awarded. Department ranking updated!`);
  };

  // Complete a green challenge
  const completeChallenge = (challengeId) => {
    if (completedChallengeIds.includes(challengeId)) return;

    const challenge = INITIAL_CHALLENGES.find((c) => c.id === challengeId);
    if (!challenge) return;

    const newLog = {
      id: `clog-${Date.now().toString().slice(-6)}`,
      challengeId,
      department: currentUser?.department || 'CSE',
      date: new Date().toISOString().split('T')[0],
      points: challenge.points,
      co2SavedKg: challenge.co2SavedKg,
      isInitial: false,
    };

    setCompletedChallengeIds((prev) => [...prev, challengeId]);
    setChallengeLogs((prev) => [...prev, newLog]);
    updateUserPoints(challenge.points, challenge.co2SavedKg);
    updateDepartmentPoints(currentUser.department, challenge.points, challenge.co2SavedKg);

    triggerConfetti();
    showToast(`Great job! Completed "${challenge.title}" (+${challenge.points} pts, ${challenge.co2SavedKg}kg CO₂ saved)`);
  };

  // Add a college event audit
  const addEventAudit = (eventData) => {
    const eventRecord = {
      id: `evt-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      organizerDept: currentUser.department,
      isInitial: false,
      ...eventData,
    };

    setEventAudits((prev) => [eventRecord, ...prev]);

    // Department gets +100 eco points for auditing an event!
    updateDepartmentPoints(eventRecord.organizerDept || currentUser.department, 100, 15);
    updateUserPoints(100, 15);

    triggerConfetti();
    showToast(`Event audit logged! "${eventRecord.name}" added to campus records (+100 Eco Points)`);
  };

  // Helper to update user points and plant stage
  const updateUserPoints = (pts, co2Kg = 0) => {
    setCurrentUser((prev) => {
      const newPoints = (prev.ecoPoints || 0) + pts;
      const newCO2 = Math.round(((prev.co2SavedTotalKg || 0) + co2Kg) * 10) / 10;
      
      // Calculate plant stage: 1 to 5
      let stage = 1;
      if (newPoints >= 1000) stage = 5;
      else if (newPoints >= 650) stage = 4;
      else if (newPoints >= 350) stage = 3;
      else if (newPoints >= 150) stage = 2;

      return {
        ...prev,
        ecoPoints: newPoints,
        co2SavedTotalKg: newCO2,
        plantStage: stage,
        lastAuditDate: new Date().toISOString().split('T')[0],
      };
    });
  };

  // Helper to update department leaderboard
  const updateDepartmentPoints = (deptId, pts, co2Kg = 0) => {
    setLeaderboard((prev) => {
      const updated = prev.map((dept) => {
        if (dept.deptId === deptId) {
          const newPts = dept.points + pts;
          const newOffset = Math.round(dept.co2OffsetKg + co2Kg);
          const students =
            dept.students !== undefined && dept.students !== null && !isNaN(Number(dept.students)) && Number(dept.students) >= 0
              ? Number(dept.students)
              : 0;
          return {
            ...dept,
            points: newPts,
            co2OffsetKg: newOffset,
            perCapitaPoints: students > 0 ? Math.round((newPts / students) * 10) / 10 : newPts > 0 ? 'N/A' : 0,
          };
        }
        return dept;
      });

      // Re-sort leaderboard by points descending
      updated.sort((a, b) => b.points - a.points);
      return updated.map((d, idx) => ({
        ...d,
        rank: idx + 1,
        badge: idx === 0 ? '🏆 Champion' : idx === 1 ? '🥈 Runner Up' : idx === 2 ? '🥉 3rd Place' : d.badge,
      }));
    });
  };

  // Calculate unlocked badges based on user's current points
  const unlockedBadges = BADGES_LIST.filter(
    (badge) => (currentUser.ecoPoints || 0) >= badge.thresholdPoints
  );

  // Authentication helper
  const loginUser = (userData) => {
    const updated = {
      ...currentUser,
      ...userData,
    };
    setCurrentUser(updated);
    setCurrentView('dashboard');
    showToast(`Welcome back, ${updated.name || 'Student'}!`);
  };

  const logoutUser = () => {
    setCurrentView('landing');
    showToast('Signed out of campus portal.');
  };

  // Reset sample data to default if needed
  const resetAllData = () => {
    localStorage.removeItem('gc_current_user');
    localStorage.removeItem('gc_audits');
    localStorage.removeItem('gc_leaderboard');
    localStorage.removeItem('gc_events');
    localStorage.removeItem('gc_completed_challenges');
    localStorage.removeItem('gc_challenge_logs');
    setCurrentUser(INITIAL_USER);
    setAuditHistory(INITIAL_AUDIT_HISTORY);
    setLeaderboard(INITIAL_LEADERBOARD);
    setEventAudits(INITIAL_EVENT_AUDITS);
    setCompletedChallengeIds(['ch-commute-clean', 'ch-zero-plastic-bottle']);
    setChallengeLogs(INITIAL_CHALLENGE_LOGS);
    showToast('Demo data successfully reset to defaults.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        currentView,
        setCurrentView,
        wizardDraft,
        setWizardDraft,
        auditHistory,
        addAudit,
        leaderboard,
        eventAudits,
        addEventAudit,
        completedChallengeIds,
        challengeLogs,
        completeChallenge,
        unlockedBadges,
        allBadges: BADGES_LIST,
        allChallenges: INITIAL_CHALLENGES,
        toast,
        showToast,
        triggerConfetti,
        loginUser,
        logoutUser,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

