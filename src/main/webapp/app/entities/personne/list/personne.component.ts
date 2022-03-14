import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPersonne } from '../personne.model';
import { PersonneService } from '../service/personne.service';
import { PersonneDeleteDialogComponent } from '../delete/personne-delete-dialog.component';

@Component({
  selector: 'jhi-personne',
  templateUrl: './personne.component.html',
})
export class PersonneComponent implements OnInit {
  personnes?: IPersonne[];
  isLoading = false;

  constructor(protected personneService: PersonneService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.personneService.query().subscribe({
      next: (res: HttpResponse<IPersonne[]>) => {
        this.isLoading = false;
        this.personnes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPersonne): number {
    return item.id!;
  }

  delete(personne: IPersonne): void {
    const modalRef = this.modalService.open(PersonneDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.personne = personne;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
