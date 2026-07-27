'use client';

import { useState, useEffect, useCallback, Fragment, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  ListSubheader,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  useTheme,
  Menu,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { ItineraryEvent } from '@/types/wedding';

interface RSVPRecord {
  invite_id: string;
  confirmed: boolean;
  email: string | null;
  phone: string | null;
  properties: Record<string, unknown> | null;
  updated_at: string | null;
}

interface Guest {
  invite_id: string;
  first_name: string;
  last_name: string;
  vietnam: boolean;
  romania: boolean;
  group: string | null;
  rsvp_vietnam: RSVPRecord | null;
  rsvp_romania: RSVPRecord | null;
}

// A row that only carries admin-set invitation data is NOT a real response.
const isResponded = (rsvp: RSVPRecord | null): boolean =>
  !!rsvp && (rsvp.properties?.invitation_only as boolean | undefined) !== true;

// Event titles this guest is restricted to; null = invited to all events.
const invitedEventsOf = (rsvp: RSVPRecord | null): string[] | null =>
  (rsvp?.properties?.invited_events as string[] | undefined) ?? null;

interface PlusOne {
  first_name: string;
  last_name: string;
}

interface FormState {
  first_name: string;
  last_name: string;
  destination: 'vietnam' | 'romania' | 'both' | '';
  plus_ones: PlusOne[];
}

const EMPTY_FORM: FormState = {
  first_name: '',
  last_name: '',
  destination: '',
  plus_ones: [],
};

function rsvpPreview(fn: string, ln: string) {
  if (!fn || !ln) return '';
  return (fn + ln[0]).toUpperCase();
}

function RSVPDetail({ label, rsvp }: { label: string; rsvp: RSVPRecord | null }) {
  if (!rsvp) return <Typography variant="caption" sx={{ color: 'text.disabled' }}>No RSVP</Typography>;

  const props = rsvp.properties ?? {};
  const rawFields: [string, string][] = [
    ['Email', rsvp.email ?? ''],
    ['Phone', rsvp.phone ?? ''],
    ['Dietary restrictions', String(props.dietary_restrictions ?? '')],
    ['Travel plans', String(props.travel_plans ?? '')],
    ['Accommodation', String(props.accommodation ?? '')],
    ['Special requests', String(props.special_requests ?? '')],
    ['Message', String(props.special_message ?? '')],
    ['Arrival date', String(props.tentative_arrival_date ?? '')],
    ['RSVPd on behalf of', String(props.rsvp_on_behalf ?? '')],
  ];
  const fields = rawFields.filter(([, v]) => v && v !== 'undefined');

  const eventAttendance = props.event_attendance as Record<string, boolean> | undefined;
  const responded = isResponded(rsvp);
  const invited = invitedEventsOf(rsvp);

  return (
    <Box>
      <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label} —{' '}
        <Chip
          label={responded ? (rsvp.confirmed ? 'Attending' : 'Declined') : 'No response yet'}
          size="small"
          color={responded ? (rsvp.confirmed ? 'success' : 'error') : 'default'}
          variant="outlined"
          sx={{ height: 18, fontSize: '0.65rem' }}
        />
      </Typography>
      {invited && (
        <Typography variant="caption" display="block" sx={{ color: 'text.secondary', pl: 1 }}>
          <strong>Invited to:</strong> {invited.length > 0 ? invited.join(', ') : '(no events)'}
        </Typography>
      )}
      {fields.map(([key, val]) => (
        <Typography key={key} variant="caption" display="block" sx={{ color: 'text.secondary', pl: 1 }}>
          <strong>{key}:</strong> {val}
        </Typography>
      ))}
      {eventAttendance && Object.keys(eventAttendance).length > 0 && (
        <Box sx={{ pl: 1 }}>
          <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
            <strong>Events:</strong>{' '}
            {Object.entries(eventAttendance)
              .map(([k, v]) => `${k}: ${v ? 'yes' : 'no'}`)
              .join(', ')}
          </Typography>
        </Box>
      )}
      {rsvp.updated_at && (
        <Typography variant="caption" display="block" sx={{ color: 'text.disabled', pl: 1 }}>
          Submitted: {new Date(rsvp.updated_at).toLocaleString()}
        </Typography>
      )}
    </Box>
  );
}

function GuestRow({
  guest,
  onDelete,
  onSetRsvp,
  onManage,
  isSelected,
  onToggleSelect,
}: {
  guest: Guest;
  onDelete: (id: string) => Promise<void>;
  onSetRsvp: (id: string, location: 'vietnam' | 'romania', status: 'attending' | 'declined' | 'none') => Promise<void>;
  onManage: (id: string) => void;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const hasAnyRsvp = !!(guest.rsvp_vietnam || guest.rsvp_romania);

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    await onDelete(guest.invite_id);
    setDeleting(false);
    setConfirmOpen(false);
  };

  return (
    <Fragment>
      <TableRow
        sx={{
          '& td': { borderBottom: open ? 0 : undefined },
        }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            size="small"
            checked={isSelected}
            onChange={() => onToggleSelect(guest.invite_id)}
          />
        </TableCell>
        <TableCell sx={{ width: 28, pr: 0 }}>
          <IconButton
            size="small"
            onClick={() => hasAnyRsvp && setOpen((o) => !o)}
            disabled={!hasAnyRsvp}
            sx={{ opacity: hasAnyRsvp ? 1 : 0, p: 0.5 }}
          >
            {open ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
          </IconButton>
        </TableCell>
        <TableCell>
          <code style={{ fontSize: '0.78rem', fontWeight: 700 }}>{guest.invite_id}</code>
        </TableCell>
        <TableCell>{guest.first_name} {guest.last_name}</TableCell>
        <TableCell>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {guest.group ?? '—'}
          </Typography>
        </TableCell>
        <TableCell>
          {guest.vietnam ? (
            <RsvpChip
              rsvp={guest.rsvp_vietnam}
              onSetStatus={(status) => onSetRsvp(guest.invite_id, 'vietnam', status)}
            />
          ) : (
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>—</Typography>
          )}
        </TableCell>
        <TableCell>
          {guest.romania ? (
            <RsvpChip
              rsvp={guest.rsvp_romania}
              onSetStatus={(status) => onSetRsvp(guest.invite_id, 'romania', status)}
            />
          ) : (
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>—</Typography>
          )}
        </TableCell>
        <TableCell sx={{ width: 72, pl: 0, whiteSpace: 'nowrap' }}>
          <IconButton
            size="small"
            onClick={() => onManage(guest.invite_id)}
            title="Manage invitations & response"
            sx={{ color: theme.palette.primary.main, opacity: 0.6, '&:hover': { opacity: 1 } }}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setConfirmOpen(true)}
            sx={{ color: theme.palette.error.main, opacity: 0.6, '&:hover': { opacity: 1 } }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>

      {hasAnyRsvp && (
        <TableRow sx={{ background: theme.palette.action.selected }}>
          <TableCell colSpan={8} sx={{ py: 0, px: 2 }}>
            <Collapse in={open} unmountOnExit>
              <Box sx={{ py: 2, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {guest.vietnam && (
                  <RSVPDetail label="Vietnam" rsvp={guest.rsvp_vietnam} />
                )}
                {guest.romania && (
                  <RSVPDetail label="Romania" rsvp={guest.rsvp_romania} />
                )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Delete guest?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently remove{' '}
            <strong>{guest.first_name} {guest.last_name}</strong> ({guest.invite_id}) and all
            their RSVP data. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={deleting}
            onClick={handleDeleteConfirm}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {deleting ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

function RsvpChip({
  rsvp,
  onSetStatus,
}: {
  rsvp: RSVPRecord | null;
  onSetStatus: (status: 'attending' | 'declined' | 'none') => Promise<void>;
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [busy, setBusy] = useState(false);

  const responded = isResponded(rsvp);
  const currentStatus: 'attending' | 'declined' | 'none' = !responded
    ? 'none'
    : rsvp!.confirmed
    ? 'attending'
    : 'declined';

  const label = !responded ? 'No RSVP' : rsvp!.confirmed ? 'Attending' : 'Declined';
  const color: 'success' | 'error' | 'default' = !responded ? 'default' : rsvp!.confirmed ? 'success' : 'error';

  const handleSelect = async (next: 'attending' | 'declined' | 'none') => {
    setAnchorEl(null);
    if (next === currentStatus) return;
    setBusy(true);
    try {
      await onSetStatus(next);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Chip
        label={busy ? '…' : label}
        size="small"
        color={color}
        variant="outlined"
        clickable
        onClick={(e) => setAnchorEl(e.currentTarget)}
        disabled={busy}
        sx={{ fontSize: '0.7rem', height: 20, cursor: 'pointer' }}
      />
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem selected={currentStatus === 'attending'} onClick={() => handleSelect('attending')}>
          Attending
        </MenuItem>
        <MenuItem selected={currentStatus === 'declined'} onClick={() => handleSelect('declined')}>
          Declined
        </MenuItem>
        <MenuItem selected={currentStatus === 'none'} onClick={() => handleSelect('none')}>
          No RSVP
        </MenuItem>
      </Menu>
    </>
  );
}

// Per-wedding management: which sub-events the guest is invited to + their response.
function LocationManager({
  location,
  label,
  rsvp,
  events,
  onSetInvited,
  onEdit,
  onSetStatus,
}: {
  location: 'vietnam' | 'romania';
  label: string;
  rsvp: RSVPRecord | null;
  events: ItineraryEvent[];
  onSetInvited: (invited: string[] | null) => Promise<void>;
  onEdit: (fields: {
    confirmed: boolean;
    email?: string | null;
    phone?: string | null;
    properties?: Record<string, unknown>;
  }) => Promise<void>;
  onSetStatus: (status: 'none') => Promise<void>;
}) {
  const props = (rsvp?.properties ?? {}) as Record<string, unknown>;
  const initialInvited = invitedEventsOf(rsvp);

  const [invitedSel, setInvitedSel] = useState<Record<string, boolean>>(() => {
    const sel: Record<string, boolean> = {};
    events.forEach((e) => {
      sel[e.title] = initialInvited ? initialInvited.includes(e.title) : true;
    });
    return sel;
  });
  const [status, setStatus] = useState<'attending' | 'declined' | 'none'>(
    isResponded(rsvp) ? (rsvp!.confirmed ? 'attending' : 'declined') : 'none'
  );
  const [email, setEmail] = useState<string>(rsvp?.email ?? '');
  const [phone, setPhone] = useState<string>(rsvp?.phone ?? '');
  const [dietary, setDietary] = useState<string>(String(props.dietary_restrictions ?? ''));
  const [arrival, setArrival] = useState<string>(String(props.tentative_arrival_date ?? ''));
  const [message, setMessage] = useState<string>(String(props.special_message ?? ''));
  const [attendance, setAttendance] = useState<Record<string, boolean>>(
    (props.event_attendance as Record<string, boolean> | undefined) ?? {}
  );
  const [savingInv, setSavingInv] = useState(false);
  const [savingResp, setSavingResp] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const invitedTitles = events.filter((e) => invitedSel[e.title]).map((e) => e.title);
  const allInvited = events.length > 0 && events.every((e) => invitedSel[e.title]);

  const saveInvitations = async () => {
    setSavingInv(true);
    setNote(null);
    try {
      await onSetInvited(allInvited ? null : invitedTitles);
      setNote('Invitations saved.');
    } finally {
      setSavingInv(false);
    }
  };

  const saveResponse = async () => {
    setSavingResp(true);
    setNote(null);
    try {
      if (status === 'none') {
        await onSetStatus('none');
      } else {
        // Only record attendance for events the guest is invited to.
        const event_attendance: Record<string, boolean> = {};
        invitedTitles.forEach((t) => { event_attendance[t] = attendance[t] ?? true; });
        await onEdit({
          confirmed: status === 'attending',
          email: email.trim() || null,
          phone: phone.trim() || null,
          properties: {
            dietary_restrictions: dietary.trim() || undefined,
            tentative_arrival_date: arrival.trim() || undefined,
            special_message: message.trim() || undefined,
            event_attendance: invitedTitles.length > 0 ? event_attendance : undefined,
          },
        });
      }
      setNote('Response saved.');
    } finally {
      setSavingResp(false);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2.5, mb: 2, borderRadius: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>{label}</Typography>

      {/* Invited events */}
      <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
        Invited to which events
      </Typography>
      {events.length === 0 ? (
        <Typography variant="body2" sx={{ color: 'text.disabled', mt: 0.5 }}>No RSVP-able events found for this wedding.</Typography>
      ) : (
        <FormGroup sx={{ mt: 0.5 }}>
          {events.map((e) => (
            <FormControlLabel
              key={e.title}
              control={
                <Checkbox
                  size="small"
                  checked={invitedSel[e.title] ?? false}
                  onChange={(ev) => setInvitedSel((prev) => ({ ...prev, [e.title]: ev.target.checked }))}
                />
              }
              label={<Typography variant="body2">{e.title}{e.date ? <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}> · {e.date}</Typography> : null}</Typography>}
            />
          ))}
        </FormGroup>
      )}
      <Box sx={{ mt: 0.5, mb: 2 }}>
        <Button size="small" variant="outlined" onClick={saveInvitations} disabled={savingInv || events.length === 0} sx={{ textTransform: 'none', borderRadius: 2 }}>
          {savingInv ? <CircularProgress size={16} /> : (allInvited ? 'Save (invited to all)' : 'Save invitations')}
        </Button>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      {/* Response */}
      <FormControl sx={{ mb: 1 }}>
        <FormLabel sx={{ fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Response</FormLabel>
        <RadioGroup row value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
          <FormControlLabel value="attending" control={<Radio size="small" />} label="Attending" />
          <FormControlLabel value="declined" control={<Radio size="small" />} label="Declined" />
          <FormControlLabel value="none" control={<Radio size="small" />} label="No response" />
        </RadioGroup>
      </FormControl>

      {status === 'attending' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <TextField label="Email" size="small" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ flex: '1 1 200px' }} />
            <TextField label="Phone" size="small" value={phone} onChange={(e) => setPhone(e.target.value)} sx={{ flex: '1 1 160px' }} />
          </Box>
          <TextField label="Dietary restrictions" size="small" value={dietary} onChange={(e) => setDietary(e.target.value)} fullWidth />
          <TextField label="Tentative arrival date" size="small" value={arrival} onChange={(e) => setArrival(e.target.value)} fullWidth />
          <TextField label="Message" size="small" value={message} onChange={(e) => setMessage(e.target.value)} fullWidth multiline rows={2} />
          {invitedTitles.length > 0 && (
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Attending which events</Typography>
              <FormGroup>
                {invitedTitles.map((t) => (
                  <FormControlLabel
                    key={t}
                    control={
                      <Checkbox
                        size="small"
                        checked={attendance[t] ?? true}
                        onChange={(ev) => setAttendance((prev) => ({ ...prev, [t]: ev.target.checked }))}
                      />
                    }
                    label={<Typography variant="body2">{t}</Typography>}
                  />
                ))}
              </FormGroup>
            </Box>
          )}
        </Box>
      )}

      <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button size="small" variant="contained" onClick={saveResponse} disabled={savingResp} sx={{ textTransform: 'none', borderRadius: 2 }}>
          {savingResp ? <CircularProgress size={16} sx={{ color: 'white' }} /> : 'Save response'}
        </Button>
        {note && <Typography variant="caption" sx={{ color: 'success.main' }}>{note}</Typography>}
      </Box>
    </Paper>
  );
}

function GuestIdentityEditor({
  guest,
  onSave,
}: {
  guest: Guest;
  onSave: (fields: { first_name?: string; last_name?: string; group?: string | null }) => Promise<void>;
}) {
  const [firstName, setFirstName] = useState(guest.first_name);
  const [lastName, setLastName] = useState(guest.last_name);
  const [group, setGroup] = useState(guest.group ?? '');
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const dirty =
    firstName.trim() !== guest.first_name ||
    lastName.trim() !== guest.last_name ||
    (group.trim() || null) !== (guest.group ?? null);

  const handleSave = async () => {
    setErr(null);
    setNote(null);
    if (!firstName.trim() || !lastName.trim()) {
      setErr('First and last name are required.');
      return;
    }
    setSaving(true);
    try {
      const fields: { first_name?: string; last_name?: string; group?: string | null } = {};
      if (firstName.trim() !== guest.first_name) fields.first_name = firstName.trim();
      if (lastName.trim() !== guest.last_name) fields.last_name = lastName.trim();
      const nextGroup = group.trim() || null;
      if (nextGroup !== (guest.group ?? null)) fields.group = nextGroup;
      await onSave(fields);
      setNote('Saved.');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2.5, mb: 2, borderRadius: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>Guest details</Typography>
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <TextField
          label="First name"
          size="small"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          sx={{ flex: '1 1 140px' }}
        />
        <TextField
          label="Last name"
          size="small"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          sx={{ flex: '1 1 140px' }}
        />
        <TextField
          label="Group"
          size="small"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          placeholder="(none)"
          sx={{ flex: '1 1 200px' }}
        />
      </Box>
      <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          size="small"
          variant="contained"
          onClick={handleSave}
          disabled={saving || !dirty}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          {saving ? <CircularProgress size={16} sx={{ color: 'white' }} /> : 'Save details'}
        </Button>
        {err && <Typography variant="caption" sx={{ color: 'error.main' }}>{err}</Typography>}
        {note && <Typography variant="caption" sx={{ color: 'success.main' }}>{note}</Typography>}
      </Box>
    </Paper>
  );
}

function ManageDialog({
  guest,
  rsvpEvents,
  onClose,
  onSetInvited,
  onEdit,
  onSetStatus,
  onEditGuest,
}: {
  guest: Guest;
  rsvpEvents: { vietnam: ItineraryEvent[]; romania: ItineraryEvent[] };
  onClose: () => void;
  onSetInvited: (id: string, location: 'vietnam' | 'romania', invited: string[] | null) => Promise<void>;
  onEdit: (
    id: string,
    location: 'vietnam' | 'romania',
    fields: { confirmed: boolean; email?: string | null; phone?: string | null; properties?: Record<string, unknown> }
  ) => Promise<void>;
  onSetStatus: (id: string, location: 'vietnam' | 'romania', status: 'attending' | 'declined' | 'none') => Promise<void>;
  onEditGuest: (id: string, fields: { first_name?: string; last_name?: string; group?: string | null }) => Promise<void>;
}) {
  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>
        Manage — {guest.first_name} {guest.last_name}{' '}
        <code style={{ fontSize: '0.8rem' }}>{guest.invite_id}</code>
      </DialogTitle>
      <DialogContent dividers>
        <GuestIdentityEditor
          guest={guest}
          onSave={(f) => onEditGuest(guest.invite_id, f)}
        />
        {guest.vietnam && (
          <LocationManager
            location="vietnam"
            label="Vietnam"
            rsvp={guest.rsvp_vietnam}
            events={rsvpEvents.vietnam}
            onSetInvited={(ie) => onSetInvited(guest.invite_id, 'vietnam', ie)}
            onEdit={(f) => onEdit(guest.invite_id, 'vietnam', f)}
            onSetStatus={(s) => onSetStatus(guest.invite_id, 'vietnam', s)}
          />
        )}
        {guest.romania && (
          <LocationManager
            location="romania"
            label="Romania"
            rsvp={guest.rsvp_romania}
            events={rsvpEvents.romania}
            onSetInvited={(ie) => onSetInvited(guest.invite_id, 'romania', ie)}
            onEdit={(f) => onEdit(guest.invite_id, 'romania', f)}
            onSetStatus={(s) => onSetStatus(guest.invite_id, 'romania', s)}
          />
        )}
        {!guest.vietnam && !guest.romania && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            This guest is not invited to either wedding.
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

function BulkCeremoniesDialog({
  location,
  events,
  count,
  busy,
  onCancel,
  onSubmit,
}: {
  location: 'vietnam' | 'romania';
  events: ItineraryEvent[];
  count: number;
  busy: boolean;
  onCancel: () => void;
  onSubmit: (invited: string[] | null) => Promise<void>;
}) {
  const [mode, setMode] = useState<'all' | 'subset'>('all');
  const [sel, setSel] = useState<Record<string, boolean>>(() => {
    const s: Record<string, boolean> = {};
    events.forEach((e) => { s[e.title] = true; });
    return s;
  });

  const invitedTitles = events.filter((e) => sel[e.title]).map((e) => e.title);
  const label = location === 'romania' ? 'Romania' : 'Vietnam';

  const handleConfirm = () => {
    if (mode === 'all') {
      void onSubmit(null);
    } else {
      void onSubmit(invitedTitles);
    }
  };

  return (
    <Dialog open onClose={busy ? undefined : onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>
        {label} ceremonies for {count} guest{count === 1 ? '' : 's'}
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText sx={{ mb: 2 }}>
          Guests not invited to {label} will be skipped.
        </DialogContentText>
        <RadioGroup value={mode} onChange={(e) => setMode(e.target.value as 'all' | 'subset')}>
          <FormControlLabel value="all" control={<Radio size="small" />} label="Invite to all ceremonies" />
          <FormControlLabel value="subset" control={<Radio size="small" />} label="Only these ceremonies:" />
        </RadioGroup>
        <FormGroup sx={{ pl: 3, mt: 0.5, opacity: mode === 'subset' ? 1 : 0.5, pointerEvents: mode === 'subset' ? 'auto' : 'none' }}>
          {events.map((e) => (
            <FormControlLabel
              key={e.title}
              control={
                <Checkbox
                  size="small"
                  checked={sel[e.title] ?? false}
                  onChange={(ev) => setSel((prev) => ({ ...prev, [e.title]: ev.target.checked }))}
                />
              }
              label={
                <Typography variant="body2">
                  {e.title}
                  {e.date ? (
                    <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>
                      {' '}· {e.date}
                    </Typography>
                  ) : null}
                </Typography>
              }
            />
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} disabled={busy} sx={{ textTransform: 'none' }}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={busy || (mode === 'subset' && invitedTitles.length === 0)}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          {busy ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Apply'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function AdminPage() {
  const theme = useTheme();
  const router = useRouter();

  const [isVerifying, setIsVerifying] = useState(true);
  const [adminInviteId, setAdminInviteId] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    guests: Array<{ invite_id: string; first_name: string; last_name: string }>;
    group: string | null;
  } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [loadingGuests, setLoadingGuests] = useState(false);
  const [rsvpEvents, setRsvpEvents] = useState<{ vietnam: ItineraryEvent[]; romania: ItineraryEvent[] }>({
    vietnam: [],
    romania: [],
  });
  const [manageId, setManageId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'vietnam' | 'romania'>('all');
  const [rsvpFilter, setRsvpFilter] = useState<'all' | 'attending' | 'declined' | 'no_rsvp'>('all');
  const [sortBy, setSortBy] = useState<'invite_id' | 'name' | 'group' | 'vietnam' | 'romania'>('invite_id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [bulkSelectedIds, setBulkSelectedIds] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkConfirm, setBulkConfirm] = useState<{ location: 'vietnam' | 'romania'; invited: boolean } | null>(null);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkNote, setBulkNote] = useState<string | null>(null);
  const [bulkEventsFor, setBulkEventsFor] = useState<'vietnam' | 'romania' | null>(null);
  const [ceremonyFilter, setCeremonyFilter] = useState<string>('all'); // 'all' | 'vietnam::<title>' | 'romania::<title>'

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  const fetchGuests = useCallback(async (inviteId: string) => {
    setLoadingGuests(true);
    try {
      const res = await fetch(`/api/admin?invite_id=${encodeURIComponent(inviteId)}`);
      if (res.ok) {
        const data = await res.json();
        setGuests(data.guests ?? []);
      }
    } finally {
      setLoadingGuests(false);
    }
  }, []);

  useEffect(() => {
    const savedInviteId = Cookies.get('invite_id');
    if (!savedInviteId) { router.push('/'); return; }

    fetch('/api/guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invite_id: savedInviteId }),
    })
      .then((r) => r.json())
      .then((data) => {
        const isAdmin =
          (data.first_name?.toLowerCase() === 'catalina' && data.last_name?.toLowerCase() === 'ionescu') ||
          (data.first_name?.toLowerCase() === 'lam' && data.last_name?.toLowerCase() === 'nguyen');
        if (!isAdmin) { router.push('/'); return; }
        const id = savedInviteId.toUpperCase();
        setAdminInviteId(id);
        setIsVerifying(false);
        fetchGuests(id);
      })
      .catch(() => router.push('/'));
  }, [router, fetchGuests]);

  // Load both weddings' RSVP-able sub-events so the admin can manage invitations.
  useEffect(() => {
    const extract = (data: { days?: Array<{ date?: string; events?: ItineraryEvent[] }> }) =>
      (data.days || [])
        .flatMap((d) => (d.events || []).map((e) => ({ ...e, date: d.date })))
        .filter((e) => e.type === 'Event');

    fetch('/api/vietnam-timeline')
      .then((r) => r.json())
      .then((d) => setRsvpEvents((prev) => ({ ...prev, vietnam: extract(d) })))
      .catch(() => {});
    fetch('/api/romania-timeline')
      .then((r) => r.json())
      .then((d) => setRsvpEvents((prev) => ({ ...prev, romania: extract(d) })))
      .catch(() => {});
  }, []);

  const addPlusOne = () =>
    setForm((f) => ({ ...f, plus_ones: [...f.plus_ones, { first_name: '', last_name: '' }] }));

  const removePlusOne = (i: number) =>
    setForm((f) => ({ ...f, plus_ones: f.plus_ones.filter((_, idx) => idx !== i) }));

  const updatePlusOne = (i: number, field: keyof PlusOne, value: string) =>
    setForm((f) => ({
      ...f,
      plus_ones: f.plus_ones.map((po, idx) => (idx === i ? { ...po, [field]: value } : po)),
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitResult(null);

    if (!form.first_name || !form.last_name || !form.destination) {
      setFormError('Please fill in all required fields.');
      return;
    }

    for (const po of form.plus_ones) {
      if (!po.first_name.trim() || !po.last_name.trim()) {
        setFormError('Please fill in first and last name for all plus-ones.');
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_invite_id: adminInviteId,
          first_name: form.first_name,
          last_name: form.last_name,
          destination: form.destination,
          plus_ones: form.plus_ones,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? 'Failed to add guest.');
      } else {
        setSubmitResult({ guests: data.guests, group: data.group });
        setForm(EMPTY_FORM);
        fetchGuests(adminInviteId!);
      }
    } catch {
      setFormError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Email section state ──────────────────────────────────────────────────
  const [emailGroup, setEmailGroup] = useState<string>('__all__');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [emailResult, setEmailResult] = useState<{ sent: string[]; skipped: string[]; failed: string[] } | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const getGuestEmail = (g: Guest) => g.rsvp_vietnam?.email ?? g.rsvp_romania?.email ?? null;

  const groups = useMemo(() => {
    const s = new Set<string>();
    guests.forEach((g) => { if (g.group) s.add(g.group); });
    return Array.from(s).sort();
  }, [guests]);

  const hasUngrouped = useMemo(() => guests.some((g) => !g.group), [guests]);

  const recipientPool = useMemo(() => {
    if (emailGroup === '__all__') return guests;
    if (emailGroup === '__ungrouped__') return guests.filter((g) => !g.group);
    return guests.filter((g) => g.group === emailGroup);
  }, [guests, emailGroup]);

  const poolWithEmail = useMemo(() => recipientPool.filter((g) => getGuestEmail(g)), [recipientPool]);
  const allSelected = poolWithEmail.length > 0 && poolWithEmail.every((g) => selectedIds.has(g.invite_id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        poolWithEmail.forEach((g) => next.delete(g.invite_id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        poolWithEmail.forEach((g) => next.add(g.invite_id));
        return next;
      });
    }
  };

  const toggleId = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleSendEmail = async () => {
    setEmailError(null);
    setEmailResult(null);
    if (selectedIds.size === 0) { setEmailError('Select at least one recipient.'); return; }
    if (!emailSubject.trim()) { setEmailError('Subject is required.'); return; }
    if (!emailMessage.trim()) { setEmailError('Message is required.'); return; }

    setSending(true);
    try {
      const res = await fetch('/api/admin/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_invite_id: adminInviteId,
          invite_ids: Array.from(selectedIds),
          subject: emailSubject,
          message: emailMessage,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEmailError(data.error ?? 'Failed to send emails.');
      } else {
        setEmailResult(data);
        setSelectedIds(new Set());
        setEmailSubject('');
        setEmailMessage('');
      }
    } catch {
      setEmailError('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (targetId: string) => {
    await fetch('/api/admin', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ admin_invite_id: adminInviteId, target_invite_id: targetId }),
    });
    fetchGuests(adminInviteId!);
  };

  const handleSetRsvp = async (
    targetId: string,
    location: 'vietnam' | 'romania',
    status: 'attending' | 'declined' | 'none'
  ) => {
    await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        admin_invite_id: adminInviteId,
        target_invite_id: targetId,
        location,
        status,
      }),
    });
    fetchGuests(adminInviteId!);
  };

  const handleSetInvitedEvents = async (
    targetId: string,
    location: 'vietnam' | 'romania',
    invited_events: string[] | null
  ) => {
    await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        admin_invite_id: adminInviteId,
        target_invite_id: targetId,
        location,
        action: 'set_invited_events',
        invited_events,
      }),
    });
    await fetchGuests(adminInviteId!);
  };

  const toggleBulkId = (id: string) =>
    setBulkSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleBulkInvite = async (location: 'vietnam' | 'romania', invited: boolean) => {
    setBulkError(null);
    setBulkNote(null);
    if (bulkSelectedIds.size === 0) return;
    setBulkBusy(true);
    try {
      const res = await fetch('/api/admin/bulk-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_invite_id: adminInviteId,
          target_invite_ids: Array.from(bulkSelectedIds),
          location,
          invited,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBulkError(data.error ?? 'Bulk update failed.');
        return;
      }
      const verb = invited ? 'Invited' : 'Disinvited';
      const rsvpNote = !invited && data.rsvp_deleted > 0 ? ` (removed ${data.rsvp_deleted} RSVP row${data.rsvp_deleted === 1 ? '' : 's'})` : '';
      setBulkNote(`${verb} ${data.updated} guest${data.updated === 1 ? '' : 's'} — ${location === 'romania' ? 'Romania' : 'Vietnam'}${rsvpNote}.`);
      setBulkSelectedIds(new Set());
      await fetchGuests(adminInviteId!);
    } catch {
      setBulkError('Network error. Please try again.');
    } finally {
      setBulkBusy(false);
      setBulkConfirm(null);
    }
  };

  const handleEditGuest = async (
    targetId: string,
    guest_fields: { first_name?: string; last_name?: string; group?: string | null }
  ) => {
    const res = await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        admin_invite_id: adminInviteId,
        target_invite_id: targetId,
        action: 'edit_guest',
        guest_fields,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? 'Failed to update guest.');
    }
    await fetchGuests(adminInviteId!);
  };

  const handleBulkSetEvents = async (
    location: 'vietnam' | 'romania',
    invited_events: string[] | null
  ) => {
    setBulkError(null);
    setBulkNote(null);
    if (bulkSelectedIds.size === 0) return;
    setBulkBusy(true);
    try {
      const res = await fetch('/api/admin/bulk-set-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_invite_id: adminInviteId,
          target_invite_ids: Array.from(bulkSelectedIds),
          location,
          invited_events,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBulkError(data.error ?? 'Bulk update failed.');
        return;
      }
      const scope = location === 'romania' ? 'Romania' : 'Vietnam';
      const target = invited_events === null ? 'all ceremonies' : `${invited_events.length} ceremon${invited_events.length === 1 ? 'y' : 'ies'}`;
      const skipNote = data.skipped_not_invited > 0
        ? ` (skipped ${data.skipped_not_invited} not invited to ${scope})`
        : '';
      setBulkNote(`Updated ${data.updated} guest${data.updated === 1 ? '' : 's'} for ${scope} — ${target}${skipNote}.`);
      setBulkSelectedIds(new Set());
      setBulkEventsFor(null);
      await fetchGuests(adminInviteId!);
    } catch {
      setBulkError('Network error. Please try again.');
    } finally {
      setBulkBusy(false);
    }
  };

  const handleEditRsvp = async (
    targetId: string,
    location: 'vietnam' | 'romania',
    fields: {
      confirmed: boolean;
      email?: string | null;
      phone?: string | null;
      properties?: Record<string, unknown>;
    }
  ) => {
    await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        admin_invite_id: adminInviteId,
        target_invite_id: targetId,
        location,
        action: 'edit',
        fields,
      }),
    });
    await fetchGuests(adminInviteId!);
  };

  const rsvpStatus = (rsvp: RSVPRecord | null): 'attending' | 'declined' | 'no_rsvp' => {
    if (!isResponded(rsvp)) return 'no_rsvp';
    return rsvp!.confirmed ? 'attending' : 'declined';
  };

  const matchesRsvpFilter = (g: Guest): boolean => {
    if (rsvpFilter === 'all') return true;
    const relevantRsvps: Array<RSVPRecord | null> = [];
    if ((filter === 'all' || filter === 'vietnam') && g.vietnam) relevantRsvps.push(g.rsvp_vietnam);
    if ((filter === 'all' || filter === 'romania') && g.romania) relevantRsvps.push(g.rsvp_romania);
    if (relevantRsvps.length === 0) return false;
    return relevantRsvps.some((r) => rsvpStatus(r) === rsvpFilter);
  };

  const matchesCeremonyFilter = (g: Guest): boolean => {
    if (ceremonyFilter === 'all') return true;
    const [loc, ...titleParts] = ceremonyFilter.split('::');
    const title = titleParts.join('::');
    if (loc !== 'vietnam' && loc !== 'romania') return true;
    const invitedToWedding = loc === 'vietnam' ? g.vietnam : g.romania;
    if (!invitedToWedding) return false;
    const rsvp = loc === 'vietnam' ? g.rsvp_vietnam : g.rsvp_romania;
    const invited = invitedEventsOf(rsvp);
    if (invited === null) return true; // invited to all ceremonies
    return invited.includes(title);
  };

  const filteredGuests = guests.filter((g) => {
    if (filter === 'vietnam' && !g.vietnam) return false;
    if (filter === 'romania' && !g.romania) return false;
    if (!matchesCeremonyFilter(g)) return false;
    return matchesRsvpFilter(g);
  });

  const rsvpSortRank: Record<'attending' | 'declined' | 'no_rsvp' | 'na', number> = {
    attending: 0,
    declined: 1,
    no_rsvp: 2,
    na: 3,
  };
  const compareRsvpCell = (invited: boolean, rsvp: RSVPRecord | null): number => {
    if (!invited) return rsvpSortRank.na;
    return rsvpSortRank[rsvpStatus(rsvp)];
  };

  const sortedGuests = useMemo(() => {
    const arr = [...filteredGuests];
    arr.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'invite_id':
          cmp = a.invite_id.localeCompare(b.invite_id);
          break;
        case 'name':
          cmp = `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
          break;
        case 'group':
          cmp = (a.group ?? '￿').localeCompare(b.group ?? '￿');
          break;
        case 'vietnam':
          cmp = compareRsvpCell(a.vietnam, a.rsvp_vietnam) - compareRsvpCell(b.vietnam, b.rsvp_vietnam);
          break;
        case 'romania':
          cmp = compareRsvpCell(a.romania, a.rsvp_romania) - compareRsvpCell(b.romania, b.rsvp_romania);
          break;
      }
      if (cmp === 0) cmp = a.invite_id.localeCompare(b.invite_id);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredGuests, sortBy, sortDir]);

  const vnCount = guests.filter((g) => g.vietnam).length;
  const roCount = guests.filter((g) => g.romania).length;

  const visibleAllSelected =
    sortedGuests.length > 0 && sortedGuests.every((g) => bulkSelectedIds.has(g.invite_id));
  const visibleSomeSelected =
    !visibleAllSelected && sortedGuests.some((g) => bulkSelectedIds.has(g.invite_id));

  const toggleBulkSelectAllVisible = () => {
    setBulkSelectedIds((prev) => {
      const next = new Set(prev);
      if (visibleAllSelected) {
        sortedGuests.forEach((g) => next.delete(g.invite_id));
      } else {
        sortedGuests.forEach((g) => next.add(g.invite_id));
      }
      return next;
    });
  };

  const clearBulkSelection = () => setBulkSelectedIds(new Set());

  if (isVerifying) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.background.default, py: 6, px: { xs: 2, md: 6 } }}>
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        <Typography
          variant="h4"
          sx={{ fontFamily: '"Arizonia", cursive', color: theme.palette.primary.dark, mb: 1, fontWeight: 400 }}
        >
          Admin
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 4 }}>
          Guest management — not linked anywhere.
        </Typography>

        {/* Add Guest Form */}
        <Paper elevation={2} sx={{ p: 4, mb: 5, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Add Guest</Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Primary guest */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <TextField
                label="First Name"
                required
                value={form.first_name}
                onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
                sx={{ flex: '1 1 160px' }}
              />
              <TextField
                label="Last Name"
                required
                value={form.last_name}
                onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
                sx={{ flex: '1 1 160px' }}
              />
              <FormControl sx={{ flex: '1 1 180px' }} required>
                <InputLabel>Destination</InputLabel>
                <Select
                  label="Destination"
                  value={form.destination}
                  onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value as FormState['destination'] }))}
                >
                  <MenuItem value="vietnam">Vietnam only</MenuItem>
                  <MenuItem value="romania">Romania only</MenuItem>
                  <MenuItem value="both">Both</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Plus-ones */}
            {form.plus_ones.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Plus-ones
                </Typography>
                {form.plus_ones.map((po, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                      label="First Name"
                      size="small"
                      required
                      value={po.first_name}
                      onChange={(e) => updatePlusOne(i, 'first_name', e.target.value)}
                      sx={{ flex: '1 1 140px' }}
                    />
                    <TextField
                      label="Last Name"
                      size="small"
                      required
                      value={po.last_name}
                      onChange={(e) => updatePlusOne(i, 'last_name', e.target.value)}
                      sx={{ flex: '1 1 140px' }}
                    />
                    {po.first_name && po.last_name && (
                      <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: 80 }}>
                        ID: <strong>{rsvpPreview(po.first_name, po.last_name)}</strong>
                      </Typography>
                    )}
                    <IconButton size="small" onClick={() => removePlusOne(i)} sx={{ color: 'error.main' }}>
                      <RemoveCircleOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}

            <Box>
              <Button
                type="button"
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={addPlusOne}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Add plus-one
              </Button>
            </Box>

            {/* Preview */}
            {form.first_name && form.last_name && (
              <Box sx={{ background: theme.palette.action.hover, borderRadius: 2, px: 2, py: 1.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  Will be created:
                </Typography>
                <Typography variant="caption" display="block">
                  <code style={{ fontWeight: 700 }}>{rsvpPreview(form.first_name, form.last_name)}</code>
                  {' — '}{form.first_name} {form.last_name}
                  {form.plus_ones.length > 0 && (
                    <em style={{ marginLeft: 8 }}>group: {form.first_name}{form.last_name}s group</em>
                  )}
                </Typography>
                {form.plus_ones.map((po, i) =>
                  po.first_name && po.last_name ? (
                    <Typography key={i} variant="caption" display="block">
                      <code style={{ fontWeight: 700 }}>{rsvpPreview(po.first_name, po.last_name)}</code>
                      {' — '}{po.first_name} {po.last_name}
                    </Typography>
                  ) : null
                )}
              </Box>
            )}

            {formError && <Alert severity="error">{formError}</Alert>}

            {submitResult && (
              <Alert severity="success">
                <strong>Added!</strong>{' '}
                {submitResult.guests.map((g) => (
                  <span key={g.invite_id}>
                    <code style={{ fontWeight: 700 }}>{g.invite_id}</code> ({g.first_name} {g.last_name}){' '}
                  </span>
                ))}
                {submitResult.group && <em>· Group: {submitResult.group}</em>}
              </Alert>
            )}

            <Box>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{ px: 4, py: 1.25, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                {submitting ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Add Guest'}
              </Button>
            </Box>
          </Box>
        </Paper>

        <Divider sx={{ mb: 4 }} />

        {/* Guest List */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mr: 1 }}>
            Guests
          </Typography>

          {/* Location filter chips */}
          {(
            [
              { key: 'all', label: `All (${guests.length})` },
              { key: 'vietnam', label: `Vietnam (${vnCount})` },
              { key: 'romania', label: `Romania (${roCount})` },
            ] as const
          ).map(({ key, label }) => (
            <Chip
              key={key}
              label={label}
              onClick={() => setFilter(key)}
              variant={filter === key ? 'filled' : 'outlined'}
              color={filter === key ? 'primary' : 'default'}
              sx={{ cursor: 'pointer', fontWeight: filter === key ? 700 : 400 }}
            />
          ))}

          <Box sx={{ ml: 'auto' }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => fetchGuests(adminInviteId!)}
              disabled={loadingGuests}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* RSVP status filter chips */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, mr: 1 }}>
            RSVP:
          </Typography>
          {(
            [
              { key: 'all', label: 'All' },
              { key: 'attending', label: 'Attending' },
              { key: 'declined', label: 'Declined' },
              { key: 'no_rsvp', label: 'No RSVP' },
            ] as const
          ).map(({ key, label }) => (
            <Chip
              key={key}
              label={label}
              size="small"
              onClick={() => setRsvpFilter(key)}
              variant={rsvpFilter === key ? 'filled' : 'outlined'}
              color={rsvpFilter === key ? 'primary' : 'default'}
              sx={{ cursor: 'pointer', fontWeight: rsvpFilter === key ? 700 : 400 }}
            />
          ))}
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>Ceremony</InputLabel>
            <Select
              label="Ceremony"
              value={ceremonyFilter}
              onChange={(e) => setCeremonyFilter(e.target.value)}
            >
              <MenuItem value="all">Any ceremony</MenuItem>
              {rsvpEvents.vietnam.length > 0 && (
                <ListSubheader>Vietnam</ListSubheader>
              )}
              {rsvpEvents.vietnam.map((e) => (
                <MenuItem key={`vietnam::${e.title}`} value={`vietnam::${e.title}`}>
                  VN — {e.title}
                </MenuItem>
              ))}
              {rsvpEvents.romania.length > 0 && (
                <ListSubheader>Romania</ListSubheader>
              )}
              {rsvpEvents.romania.map((e) => (
                <MenuItem key={`romania::${e.title}`} value={`romania::${e.title}`}>
                  RO — {e.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="caption" sx={{ color: 'text.secondary', ml: 'auto', fontWeight: 500 }}>
            Showing {filteredGuests.length} of {guests.length}
          </Typography>
        </Box>

        {/* Bulk actions toolbar — visible when at least one guest is selected */}
        {bulkSelectedIds.size > 0 && (
          <Paper
            variant="outlined"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              flexWrap: 'wrap',
              px: 2,
              py: 1.25,
              mb: 2,
              borderRadius: 2,
              background: theme.palette.action.hover,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {bulkSelectedIds.size} selected
            </Typography>
            <Divider orientation="vertical" flexItem />
            <Button
              size="small"
              variant="outlined"
              disabled={bulkBusy}
              onClick={() => handleBulkInvite('vietnam', true)}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Invite to Vietnam
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              disabled={bulkBusy}
              onClick={() => setBulkConfirm({ location: 'vietnam', invited: false })}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Disinvite from Vietnam
            </Button>
            <Divider orientation="vertical" flexItem />
            <Button
              size="small"
              variant="outlined"
              disabled={bulkBusy}
              onClick={() => handleBulkInvite('romania', true)}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Invite to Romania
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              disabled={bulkBusy}
              onClick={() => setBulkConfirm({ location: 'romania', invited: false })}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Disinvite from Romania
            </Button>
            <Divider orientation="vertical" flexItem />
            <Button
              size="small"
              variant="outlined"
              disabled={bulkBusy || rsvpEvents.vietnam.length === 0}
              onClick={() => setBulkEventsFor('vietnam')}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Set Vietnam ceremonies
            </Button>
            <Button
              size="small"
              variant="outlined"
              disabled={bulkBusy || rsvpEvents.romania.length === 0}
              onClick={() => setBulkEventsFor('romania')}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Set Romania ceremonies
            </Button>
            <Box sx={{ ml: 'auto' }}>
              <Button
                size="small"
                onClick={clearBulkSelection}
                disabled={bulkBusy}
                sx={{ textTransform: 'none' }}
              >
                Clear
              </Button>
            </Box>
            {bulkBusy && <CircularProgress size={18} />}
          </Paper>
        )}

        {bulkError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setBulkError(null)}>
            {bulkError}
          </Alert>
        )}
        {bulkNote && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setBulkNote(null)}>
            {bulkNote}
          </Alert>
        )}

        {loadingGuests ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            elevation={1}
            sx={{ borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.78rem' } }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      size="small"
                      indeterminate={visibleSomeSelected}
                      checked={visibleAllSelected}
                      onChange={toggleBulkSelectAllVisible}
                      disabled={sortedGuests.length === 0}
                    />
                  </TableCell>
                  <TableCell sx={{ width: 28, pr: 0 }} />
                  <TableCell sortDirection={sortBy === 'invite_id' ? sortDir : false}>
                    <TableSortLabel
                      active={sortBy === 'invite_id'}
                      direction={sortBy === 'invite_id' ? sortDir : 'asc'}
                      onClick={() => handleSort('invite_id')}
                    >
                      Invite ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={sortBy === 'name' ? sortDir : false}>
                    <TableSortLabel
                      active={sortBy === 'name'}
                      direction={sortBy === 'name' ? sortDir : 'asc'}
                      onClick={() => handleSort('name')}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={sortBy === 'group' ? sortDir : false}>
                    <TableSortLabel
                      active={sortBy === 'group'}
                      direction={sortBy === 'group' ? sortDir : 'asc'}
                      onClick={() => handleSort('group')}
                    >
                      Group
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={sortBy === 'vietnam' ? sortDir : false}>
                    <TableSortLabel
                      active={sortBy === 'vietnam'}
                      direction={sortBy === 'vietnam' ? sortDir : 'asc'}
                      onClick={() => handleSort('vietnam')}
                    >
                      Vietnam RSVP
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={sortBy === 'romania' ? sortDir : false}>
                    <TableSortLabel
                      active={sortBy === 'romania'}
                      direction={sortBy === 'romania' ? sortDir : 'asc'}
                      onClick={() => handleSort('romania')}
                    >
                      Romania RSVP
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ width: 40 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedGuests.map((g) => (
                  <GuestRow
                    key={g.invite_id}
                    guest={g}
                    onDelete={handleDelete}
                    onSetRsvp={handleSetRsvp}
                    onManage={setManageId}
                    isSelected={bulkSelectedIds.has(g.invite_id)}
                    onToggleSelect={toggleBulkId}
                  />
                ))}
                {sortedGuests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No guests.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Divider sx={{ my: 5 }} />

        {/* Send Email */}
        <Paper elevation={2} sx={{ p: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Send Email</Typography>

          {/* Group selector + recipient list */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel>Group</InputLabel>
              <Select
                label="Group"
                value={emailGroup}
                onChange={(e) => {
                  setEmailGroup(e.target.value);
                  setSelectedIds(new Set());
                }}
              >
                <MenuItem value="__all__">All guests</MenuItem>
                {groups.map((g) => (
                  <MenuItem key={g} value={g}>{g}</MenuItem>
                ))}
                {hasUngrouped && <MenuItem value="__ungrouped__">Ungrouped</MenuItem>}
              </Select>
            </FormControl>

            <Button
              size="small"
              variant="outlined"
              onClick={toggleSelectAll}
              disabled={poolWithEmail.length === 0}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              {allSelected ? 'Deselect all' : 'Select all'}
            </Button>

            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {selectedIds.size} of {poolWithEmail.length} selected
            </Typography>
          </Box>

          {/* Recipient checkboxes */}
          <Paper
            variant="outlined"
            sx={{ p: 2, mb: 3, borderRadius: 2, maxHeight: 220, overflowY: 'auto' }}
          >
            {recipientPool.length === 0 ? (
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>No guests in this group.</Typography>
            ) : (
              <FormGroup>
                {recipientPool.map((g) => {
                  const email = getGuestEmail(g);
                  return (
                    <FormControlLabel
                      key={g.invite_id}
                      control={
                        <Checkbox
                          size="small"
                          checked={selectedIds.has(g.invite_id)}
                          onChange={() => toggleId(g.invite_id)}
                          disabled={!email}
                        />
                      }
                      label={
                        <Box component="span" sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                          <Typography variant="body2">
                            {g.first_name} {g.last_name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: email ? 'text.secondary' : 'text.disabled' }}>
                            {email ?? 'no email on file'}
                          </Typography>
                        </Box>
                      }
                    />
                  );
                })}
              </FormGroup>
            )}
          </Paper>

          {/* Subject + message */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Subject"
              size="small"
              fullWidth
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />
            <TextField
              label="Message"
              multiline
              rows={6}
              fullWidth
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              placeholder="Write your message here…"
            />

            {emailError && <Alert severity="error">{emailError}</Alert>}

            {emailResult && (
              <Alert severity={emailResult.failed.length > 0 ? 'warning' : 'success'}>
                {emailResult.sent.length > 0 && (
                  <span>Sent to {emailResult.sent.length} guest{emailResult.sent.length !== 1 ? 's' : ''}. </span>
                )}
                {emailResult.skipped.length > 0 && (
                  <span>{emailResult.skipped.length} skipped (no email on file). </span>
                )}
                {emailResult.failed.length > 0 && (
                  <span>{emailResult.failed.length} failed to send.</span>
                )}
              </Alert>
            )}

            <Box>
              <Button
                variant="contained"
                disabled={sending || selectedIds.size === 0}
                onClick={handleSendEmail}
                startIcon={sending ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <SendIcon />}
                sx={{ px: 4, py: 1.25, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                {sending ? 'Sending…' : (selectedIds.size > 0 ? `Send to ${selectedIds.size}` : 'Send')}
              </Button>
            </Box>
          </Box>
        </Paper>

        {bulkEventsFor && (
          <BulkCeremoniesDialog
            location={bulkEventsFor}
            events={bulkEventsFor === 'vietnam' ? rsvpEvents.vietnam : rsvpEvents.romania}
            count={bulkSelectedIds.size}
            busy={bulkBusy}
            onCancel={() => (!bulkBusy ? setBulkEventsFor(null) : undefined)}
            onSubmit={(invited) => handleBulkSetEvents(bulkEventsFor, invited)}
          />
        )}

        {bulkConfirm && (
          <Dialog open onClose={() => (!bulkBusy ? setBulkConfirm(null) : undefined)} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 600 }}>
              Disinvite {bulkSelectedIds.size} guest{bulkSelectedIds.size === 1 ? '' : 's'}?
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                This will remove the {bulkConfirm.location === 'romania' ? 'Romania' : 'Vietnam'} invitation for
                the selected guest{bulkSelectedIds.size === 1 ? '' : 's'} and delete any RSVP data they submitted
                for that wedding. This cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={() => setBulkConfirm(null)}
                disabled={bulkBusy}
                sx={{ textTransform: 'none' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                disabled={bulkBusy}
                onClick={() => handleBulkInvite(bulkConfirm.location, bulkConfirm.invited)}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                {bulkBusy ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Disinvite'}
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {manageId && (() => {
          const manageGuest = guests.find((g) => g.invite_id === manageId) ?? null;
          if (!manageGuest) return null;
          return (
            <ManageDialog
              guest={manageGuest}
              rsvpEvents={rsvpEvents}
              onClose={() => setManageId(null)}
              onSetInvited={handleSetInvitedEvents}
              onEdit={handleEditRsvp}
              onSetStatus={handleSetRsvp}
              onEditGuest={handleEditGuest}
            />
          );
        })()}
      </Box>
    </Box>
  );
}
