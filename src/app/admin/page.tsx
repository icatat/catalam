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
  useTheme,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

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

  return (
    <Box>
      <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label} —{' '}
        <Chip
          label={rsvp.confirmed ? 'Attending' : 'Declined'}
          size="small"
          color={rsvp.confirmed ? 'success' : 'error'}
          variant="outlined"
          sx={{ height: 18, fontSize: '0.65rem' }}
        />
      </Typography>
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

function GuestRow({ guest, onDelete }: { guest: Guest; onDelete: (id: string) => Promise<void> }) {
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
            <RsvpChip rsvp={guest.rsvp_vietnam} />
          ) : (
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>—</Typography>
          )}
        </TableCell>
        <TableCell>
          {guest.romania ? (
            <RsvpChip rsvp={guest.rsvp_romania} />
          ) : (
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>—</Typography>
          )}
        </TableCell>
        <TableCell sx={{ width: 40, pl: 0 }}>
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
          <TableCell colSpan={7} sx={{ py: 0, px: 2 }}>
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

function RsvpChip({ rsvp }: { rsvp: RSVPRecord | null }) {
  if (!rsvp) return <Chip label="No RSVP" size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />;
  return (
    <Chip
      label={rsvp.confirmed ? 'Attending' : 'Declined'}
      size="small"
      color={rsvp.confirmed ? 'success' : 'error'}
      variant="outlined"
      sx={{ fontSize: '0.7rem', height: 20 }}
    />
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
  const [filter, setFilter] = useState<'all' | 'vietnam' | 'romania'>('all');

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

  const filteredGuests = guests.filter((g) => {
    if (filter === 'vietnam') return g.vietnam;
    if (filter === 'romania') return g.romania;
    return true;
  });

  const vnCount = guests.filter((g) => g.vietnam).length;
  const roCount = guests.filter((g) => g.romania).length;

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

          {/* Filter chips */}
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
                  <TableCell sx={{ width: 28, pr: 0 }} />
                  <TableCell>Invite ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Group</TableCell>
                  <TableCell>Vietnam RSVP</TableCell>
                  <TableCell>Romania RSVP</TableCell>
                  <TableCell sx={{ width: 40 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredGuests.map((g) => (
                  <GuestRow key={g.invite_id} guest={g} onDelete={handleDelete} />
                ))}
                {filteredGuests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
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

            {selectedIds.size > 0 && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {selectedIds.size} selected
              </Typography>
            )}
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
      </Box>
    </Box>
  );
}
