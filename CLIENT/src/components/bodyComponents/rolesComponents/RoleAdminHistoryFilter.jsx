import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";
import '../../../css/FilterAdminUsers.css';
import { useTranslation } from 'react-i18next';

export default function RoleAdminHistoryFilter({ setFilters }) {
  const { t } = useTranslation();

  const [performedBy, setPerformedBy] = useState("");
  const [action, setAction] = useState("");
  const [oldRoleName, setOldRoleName] = useState("");
  const [newRoleName, setNewRoleName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const handleFilterChange = () => {
    setFilters({
      performed_by: performedBy || undefined,
      action: action || undefined,
      old_role_name: oldRoleName || undefined,
      new_role_name: newRoleName || undefined,
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
      from_time: fromTime || "00:00",
      to_time: toTime || "23:59",
      user_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  };

  const handleToggleFilter = () => {
    if (isVisible) {
      setPerformedBy("");
      setAction("");
      setOldRoleName("");
      setNewRoleName("");
      setFromDate("");
      setToDate("");
      setFromTime("");
      setToTime("");
    }
    setIsVisible(prev => !prev);
  };

  useEffect(() => {
    handleFilterChange();
  }, [performedBy, action, oldRoleName, newRoleName, fromDate, toDate, fromTime, toTime]);

  return (
    <div className="filter-wrapper">
      <button className="filter-toggle" onClick={handleToggleFilter}>
        <FontAwesomeIcon icon={isVisible ? faTimes : faFilter} />
      </button>

      {isVisible && (
        <div className="filter-container">
          {/* Performed By */}
          <input
            type="text"
            className="filter-container-input"
            placeholder={t('rolesAdminHistory.performedBy')}
            value={performedBy}
            onChange={(e) => setPerformedBy(e.target.value)}
          />

          {/* Action (created, updated, deleted) */}
          <select
            className="filter-container-input"
            value={action}
            onChange={(e) => setAction(e.target.value)}
          >
            <option value="">{t('rolesAdminHistory.action')}</option>
            <option value="created">{t('rolesAdminHistory.roleCreated')}</option>
            <option value="updated">{t('rolesAdminHistory.roleUpdated')}</option>
            <option value="deleted">{t('rolesAdminHistory.roleDeleted')}</option>
          </select>

          {/* Old Role Name */}
          <input
            type="text"
            className="filter-container-input"
            placeholder={t('rolesAdminHistory.oldRoleName')}
            value={oldRoleName}
            onChange={(e) => setOldRoleName(e.target.value)}
          />

          {/* New Role Name */}
          <input
            type="text"
            className="filter-container-input"
            placeholder={t('rolesAdminHistory.newRoleName')}
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
          />

          {/* From Date */}
          <input
            type="date"
            className="filter-container-input-date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          {/* To Date */}
          <input
            type="date"
            className="filter-container-input-date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          {/* From Time */}
          <input
            type="time"
            className="filter-container-input-time"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
          />

          {/* To Time */}
          <input
            type="time"
            className="filter-container-input-time"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
