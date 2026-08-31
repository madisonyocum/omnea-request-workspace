import { useState } from 'react';
import { ArrowDown, ArrowUp, Download, ExternalLink, GripVertical, Trash2, Upload } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Menu } from '@/components/ui/Menu';
import { Tag } from '@/components/ui/Pill';
import { TableCheckbox } from '@/components/ui/Choice';
import { person } from '@/domain/people';
import type { DocumentRow, DocumentSortKey } from '@/domain/types';
import { sortDocuments } from '@/state/selectors';
import { useWorkspace } from '@/state/workspaceContext';

interface Column {
  id: string;
  label: string;
  /** Present when the column can be sorted. */
  sortKey?: DocumentSortKey;
}

const COLUMNS: Column[] = [
  { id: 'name', label: 'Document name', sortKey: 'name' },
  { id: 'store', label: 'Store in repository?' },
  { id: 'type', label: 'Type', sortKey: 'type' },
  { id: 'source', label: 'Source', sortKey: 'source' },
  { id: 'uploadedBy', label: 'Uploaded by' },
  { id: 'uploadedAt', label: 'Uploaded at', sortKey: 'uploadedAt' },
];

/**
 * Columns keep the design's proportions (525/150/130/160/180/140) but as
 * fractions, so the table spreads evenly across whatever width it is given.
 */
const GRID =
  'grid grid-cols-[minmax(220px,3.5fr)_minmax(120px,1fr)_minmax(96px,0.87fr)_minmax(120px,1.07fr)_minmax(140px,1.2fr)_minmax(110px,0.93fr)]';

const SAMPLE_UPLOADS = [
  'Mailchimp - DPA-signed.pdf',
  'Mailchimp - Pentest summary.pdf',
  'Mailchimp - Pricing 2026.xlsx',
];

export function DocumentsView() {
  const { state, dispatch } = useWorkspace();
  const [dragging, setDragging] = useState(false);
  const rows = sortDocuments(state.documents, state.documentSort);

  const addNextDocument = () => {
    const used = new Set(state.documents.map((doc) => doc.name));
    const name = SAMPLE_UPLOADS.find((candidate) => !used.has(candidate)) ?? `Mailchimp - Attachment.pdf`;
    dispatch({ type: 'document/add', name });
  };

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border-card bg-surface-card shadow-chrome">
      <div className="flex shrink-0 flex-col gap-[10px] px-[24px] pb-[18px] pt-[20px]">
        <div className="flex items-start justify-between">
          <h2 className="text-[16px] font-semibold text-text-primary">Documents</h2>
          <div className="flex items-start gap-[10px]">
            <Button onClick={() => dispatch({ type: 'toast/show', message: 'Custom fields are managed by admins' })}>
              Add field
            </Button>
            <Menu
              width={200}
              items={COLUMNS.map((column) => ({
                id: column.id,
                label: column.label,
                disabled: column.id === 'name',
                onSelect: () =>
                  dispatch({ type: 'toast/show', message: `${column.label} column hidden` }),
              }))}
            >
              {({ open, toggle }) => (
                <Button onClick={toggle} className={cn(open && 'bg-surface-sunken')}>
                  Columns
                </Button>
              )}
            </Menu>
            <Button variant="primary" onClick={addNextDocument}>
              Add document
            </Button>
          </div>
        </div>

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            addNextDocument();
          }}
          className={cn(
            'flex flex-col items-center justify-center gap-[4px] rounded-lg border border-dashed p-[24px] transition-colors duration-150',
            dragging ? 'border-brand-600 bg-surface-brand-subtle' : 'border-border-dashed bg-[#fcfcfd]',
          )}
        >
          <Upload className={cn('size-[20px]', dragging ? 'text-brand-600' : 'text-text-tertiary')} strokeWidth={1.7} />
          <p className="text-[13px] font-medium text-text-secondary">
            Drag and drop files here, or{' '}
            <button type="button" onClick={addNextDocument} className="cursor-pointer text-brand-600 hover:underline">
              browse
            </button>
          </p>
          <p className="text-[11px] text-text-muted">PDF, DOCX or XLSX · up to 25 MB</p>
        </div>
      </div>

      <div className={cn(GRID, 'shrink-0 border-y border-border-subtle bg-surface-subtle px-[24px] py-[10px]')}>
        {COLUMNS.map((column) => (
          <HeaderCell key={column.id} column={column} />
        ))}
      </div>

      <div className="scrollbar-slim min-h-0 flex-1 overflow-y-auto">
        {rows.map((row) => (
          <Row key={row.id} row={row} />
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-[8px] border-t border-border-subtle bg-surface-subtle px-[24px] py-[12px]">
        <span className="text-[12px] text-text-muted">
          {rows.length} {rows.length === 1 ? 'result' : 'results'}
        </span>
        <div className="flex-1" />
        <span className="text-[12px] text-text-muted">
          {rows.length === 0 ? 'Nothing to show' : `1-${rows.length} of ${rows.length}`}
        </span>
      </div>
    </section>
  );
}

function HeaderCell({ column }: { column: Column }) {
  const { state, dispatch } = useWorkspace();
  const active = column.sortKey !== undefined && state.documentSort?.key === column.sortKey;
  const classes =
    'flex min-w-0 items-center gap-[4px] pr-[10px] text-[10px] font-semibold tracking-[0.8px] text-text-muted uppercase';

  if (!column.sortKey) {
    return <span className={classes}>{column.label}</span>;
  }

  const sortKey = column.sortKey;
  return (
    <button
      type="button"
      onClick={() => dispatch({ type: 'document/sort', key: sortKey })}
      className={cn(classes, 'cursor-pointer justify-self-start hover:text-text-secondary', active && 'text-text-secondary')}
    >
      {column.label}
      {active &&
        (state.documentSort?.direction === 'asc' ? (
          <ArrowUp className="size-[11px]" strokeWidth={2.4} />
        ) : (
          <ArrowDown className="size-[11px]" strokeWidth={2.4} />
        ))}
    </button>
  );
}

function Row({ row }: { row: DocumentRow }) {
  const { dispatch } = useWorkspace();
  const uploader = person(row.uploadedById);

  return (
    <div
      className={cn(
        GRID,
        'group items-center border-b border-border-subtle px-[24px] py-[13px] transition-colors duration-120 hover:bg-surface-subtle',
      )}
    >
      <div className="flex min-w-0 items-center gap-[10px] pr-[10px]">
        <Menu
          align="start"
          width={190}
          items={[
            {
              id: 'open',
              label: 'Open document',
              icon: <ExternalLink className="size-[13px]" strokeWidth={1.8} />,
              onSelect: () => dispatch({ type: 'toast/show', message: `Opening ${row.name}` }),
            },
            {
              id: 'download',
              label: 'Download',
              icon: <Download className="size-[13px]" strokeWidth={1.8} />,
              onSelect: () => dispatch({ type: 'toast/show', message: `${row.name} downloaded` }),
            },
            {
              id: 'remove',
              label: 'Remove from request',
              icon: <Trash2 className="size-[13px]" strokeWidth={1.8} />,
              tone: 'danger',
              onSelect: () => dispatch({ type: 'document/remove', documentId: row.id }),
            },
          ]}
        >
          {({ open, toggle }) => (
            <button
              type="button"
              aria-label={`Actions for ${row.name}`}
              onClick={toggle}
              className={cn(
                'flex size-[16px] shrink-0 cursor-pointer items-center justify-center rounded-xs text-text-muted transition-opacity duration-150',
                open ? 'opacity-100' : 'opacity-40 group-hover:opacity-100',
              )}
            >
              <GripVertical className="size-[13px]" strokeWidth={2} />
            </button>
          )}
        </Menu>
        <button
          type="button"
          onClick={() => dispatch({ type: 'toast/show', message: `Opening ${row.name}` })}
          className="min-w-0 cursor-pointer truncate text-[13px] font-medium text-text-primary hover:text-brand-700 hover:underline"
        >
          {row.name}
        </button>
      </div>

      <div className="min-w-0">
        <TableCheckbox
          checked={row.storeInRepository}
          label={`Store ${row.name} in repository`}
          onToggle={() => dispatch({ type: 'document/toggle-store', documentId: row.id })}
        />
      </div>

      <div className="min-w-0 pr-[10px]">{row.type && <Tag>{row.type}</Tag>}</div>

      <div className="min-w-0 pr-[10px]">
        <span className="truncate text-[12px] font-medium text-text-secondary">{row.source}</span>
      </div>

      <div className="flex min-w-0 items-center gap-[8px] pr-[10px]">
        <Avatar person={uploader} size="md" />
        <span className="truncate text-[12px] font-medium text-text-secondary">{uploader.name}</span>
      </div>

      <div className="min-w-0">
        <span className="text-[12px] text-text-muted">{row.uploadedAt}</span>
      </div>
    </div>
  );
}
