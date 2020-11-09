import { Component, OnInit } from "@angular/core";
import { EmpresasService } from "../../services/empresas.service";
import { Empresa } from "../../models/empresa";

@Component({
  selector: "app-empresas",
  templateUrl: "./empresas.component.html",
  styleUrls: ["./empresas.component.css"]
})
export class EmpresasComponent implements OnInit {
  Items: Empresa[] = [];

  constructor(private empresasService: EmpresasService) {}

  ngOnInit() {}

  GetEmpresas() {
    this.empresasService.get().subscribe((res: Empresa[]) => {
      this.Items = res;
    });
  }
}
