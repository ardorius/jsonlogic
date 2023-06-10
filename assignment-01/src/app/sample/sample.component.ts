import { Component, OnInit } from '@angular/core';
import * as jsonLogic from 'json-logic-js';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.css'],
})
export class SampleComponent implements OnInit {
  public rule: any;
  public data: any;
  public outputTask: any;
  public expanded = { rule: false, data: false, output: false };

  ngOnInit(): void {
    this.data = {
      entry: {
        _entryId: 2239,
        _contentType: 'instr-content',
        _parentControl: null,
        _parentContentType: null,
        _parentEntryId: null,
        _identifier: '22-INSTR-153',
        _identifier_source: '22-INSTR-153',
        status: 'published',
        'p-issue-date': '2022-11-17T23:00:00.0000000Z',
        'p-version': '1',
        'p-manufacturer': 'Fanuc',
        'p-equipment': 'R-2000iC-210L',
        'p-safety': ['head', 'hearing', 'respirator', 'gloves'],
        'array-d-jobs': [],
        'array-events': [
          {
            _entryId: 2252,
            _contentType: 'instr-content-event',
            _parentControl: 'array-events',
            _parentContentType: 'instr-content',
            _parentEntryId: 2239,
            _identifier: '22-INSTR-153-E7',
            _identifier_source: '22-INSTR-153-E7',
            'event-code': 'request-process-finished-creation',
            description: 'Request process was finished: Instruction creation',
            children: [],
          },
          {
            _entryId: 2251,
            _contentType: 'instr-content-event',
            _parentControl: 'array-events',
            _parentContentType: 'instr-content',
            _parentEntryId: 2239,
            _identifier: '22-INSTR-153-E6',
            _identifier_source: '22-INSTR-153-E6',
            'event-code': 'approval-approved-publishing',
            description: 'Instruction publishing was approved',
            users: ['75ee6cae-de35-4b5b-b750-b5a432ef3c56'],
            'instr-request-item': '2240',
            children: [],
          },
          {
            _entryId: 2249,
            _contentType: 'instr-content-event',
            _parentControl: 'array-events',
            _parentContentType: 'instr-content',
            _parentEntryId: 2239,
            _identifier: '22-INSTR-153-E5',
            _identifier_source: '22-INSTR-153-E5',
            'event-code': 'draft-publishers-updated',
            description: 'Draft publishers updated',
            'instr-request-item': '2240',
            users: ['75ee6cae-de35-4b5b-b750-b5a432ef3c56'],
            children: [],
          },
          {
            _entryId: 2248,
            _contentType: 'instr-content-event',
            _parentControl: 'array-events',
            _parentContentType: 'instr-content',
            _parentEntryId: 2239,
            _identifier: '22-INSTR-153-E4',
            _identifier_source: '22-INSTR-153-E4',
            'event-code': 'draft-editors-updated',
            description: 'Draft editors updated',
            'instr-request-item': '2240',
            children: [],
          },
          {
            _entryId: 2244,
            _contentType: 'instr-content-event',
            _parentControl: 'array-events',
            _parentContentType: 'instr-content',
            _parentEntryId: 2239,
            _identifier: '22-INSTR-153-E3',
            _identifier_source: '22-INSTR-153-E3',
            'event-code': 'instruction-draft-created',
            description: 'Instruction draft was created',
            children: [],
          },
          {
            _entryId: 2243,
            _contentType: 'instr-content-event',
            _parentControl: 'array-events',
            _parentContentType: 'instr-content',
            _parentEntryId: 2239,
            _identifier: '22-INSTR-153-E2',
            _identifier_source: '22-INSTR-153-E2',
            'event-code': 'draft-editors-updated',
            description: 'Draft editors updated',
            'instr-request-item': '2240',
            users: ['75ee6cae-de35-4b5b-b750-b5a432ef3c56'],
            children: [],
          },
          {
            _entryId: 2241,
            _contentType: 'instr-content-event',
            _parentControl: 'array-events',
            _parentContentType: 'instr-content',
            _parentEntryId: 2239,
            _identifier: '22-INSTR-153-E1',
            _identifier_source: '22-INSTR-153-E1',
            'event-code': 'request-process-started-creation',
            description: 'Request process was started: Instruction creation',
            'instr-request-item': '2240',
            children: [],
          },
        ],
        'array-p-jobs': [],
      },
    };

    // uloha je napisat podmienku (Rule) tak, aby vysledok podmienky bol true ak:
    this.rule = {
      and: [
        {
          in: [{ var: 'entry.status' }, ['draft', 'published']], // - zaznam je v statuse draft alebo published
        },
        {
          '!==': [{ var: 'entry._entryId' }, null], // - a zaroven: zaznam existuje// - zaznam existuje ak ma vyplnenu property _entryId
        },
        {
          reduce: [
            { var: 'entry.array-events' },// - a zaroven: zaznam nema zacaty process
            {
              if: [
                {
                  '==': [
                    { var: 'current.event-code' },
                    'request-process-started', // - zaznam nema zacaty proces ak po kazdom evente s kodom "request-process-started"
                  ],
                },
                { '==': [{ var: 'accumulator' }, null] },//uchovavam hodnotu pri prechadzani pola
                {
                  or: [
                    {
                      '==': [
                        { var: 'current.event-code' },
                        'request-process-cancelled', // nasleduje event s kodom "request-process-cancelled"
                      ],
                    },
                    {
                      '==': [
                        { var: 'current.event-code' },
                        'request-process-finished', // alebo "request-process-finished"
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };




    // poznamka:

    // - status zaznamu sa uklada do property status
    // - eventy zaznamu su ulozene v property array-events

    this.outputTask = jsonLogic.apply(this.rule, this.data);

    console.log('Sample 1 output: ' + this.outputTask); // vypíše "false", neexistuje "request-process-started"
  }
}
