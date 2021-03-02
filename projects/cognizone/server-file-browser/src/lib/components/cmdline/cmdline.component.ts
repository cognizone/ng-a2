import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Subscription } from "rxjs";

import { CliInteraction } from "../../models/cli-interaction";

@Component({
  selector: 'esco-cmdline',
  templateUrl: './cmdline.component.html',
  styleUrls: ['./cmdline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CmdlineComponent implements OnChanges, OnDestroy {
  @Input() commandLineHistory: CliInteraction[];
  @Output() submitCommand: EventEmitter<string> = new EventEmitter<string>();

  commandInput: string;
  @ViewChild('commandListContainer') private commandListContainer: ElementRef;

  private readonly subSink: Subscription = new Subscription();

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.commandLineHistory) {
      setTimeout(() => this.scrollToBottom(), 0);
    }
  }

  runCommand(): void {
    const commandInput = this.commandInput;
    this.clearInput();
    this.submitCommand.emit(commandInput);
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  private scrollToBottom(): void {
    if (this.commandListContainer?.nativeElement) {
      this.commandListContainer.nativeElement.scrollTop = this.commandListContainer.nativeElement.scrollHeight;
      this.cdr.detectChanges();
    }
  }

  private clearInput(): void {
    this.commandInput = '';
  }
}
