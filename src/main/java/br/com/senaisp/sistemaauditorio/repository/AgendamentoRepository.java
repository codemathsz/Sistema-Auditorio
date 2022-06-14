package br.com.senaisp.sistemaauditorio.repository;

import java.util.Calendar;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.senaisp.sistemaauditorio.model.Agendamento;
import br.com.senaisp.sistemaauditorio.model.Periodo;
import br.com.senaisp.sistemaauditorio.model.Status;

@Repository
public interface AgendamentoRepository extends PagingAndSortingRepository<Agendamento, Long> { 

	@Query("SELECT a FROM Agendamento a WHERE a.dataInicio >= :dataInicio  AND a.dataFinalizada <= :dataFinal")
	public List<Agendamento> validacaoDataEHora(@Param("dataInicio") Calendar dataInicio , @Param("dataFinal") Calendar dataFinal); 
	
	@Query("SELECT a FROM Agendamento a WHERE  :dataInicio <= a.dataInicio   AND :dataFinal >= a.dataInicio  AND  :dataFinal <= a.dataFinalizada")
	public List<Agendamento> validacaoDataMenor(@Param("dataInicio") Calendar dataInicio , @Param("dataFinal") Calendar dataFinal);
	
	@Query("SELECT a FROM Agendamento a WHERE :dataInicio >= a.dataInicio AND :dataInicio <= a.dataFinalizada    AND :dataFinal >= a.dataFinalizada")
	public List<Agendamento> validacaoDataMaior(@Param("dataInicio") Calendar dataInicio , @Param("dataFinal") Calendar dataFinal);
	
	@Query("SELECT a FROM Agendamento a WHERE a.dataInicio <= :dataInicio  AND a.dataFinalizada >= :dataFinal")
	public List<Agendamento> validacaoDataFora(@Param("dataInicio") Calendar dataInicio , @Param("dataFinal") Calendar dataFinal);
	
	public List<Agendamento> findByUsuarioId( Long id); 
	
	//BUSCANDO TODOS COM O STATUS PENDENTES
	@Query("SELECT a FROM Agendamento a where a.status = '0'")
	public List<Agendamento> findByStatusPendente();
	
	// BUSCANDO PELO STATUS
	public List<Agendamento> findByStatus(Status status);
	
	// BUSCANDO PELO PERIODO
	public List<Agendamento> findByPeriodo( Periodo periodo);
	
	@Query("SELECT a FROM Agendamento a WHERE a.titulo LIKE %:titulo% ")
	public List<Agendamento> findByTitulo(@Param("titulo") String titulo);
	
	
	@Query("SELECT a FROM Agendamento a WHERE a.descricao LIKE %:descricao%")
	public List<Agendamento> findByDescricao(@Param("descricao") String descricao);
	
	@Query("SELECT a FROM Agendamento a WHERE a.status != 2")
	public List<Agendamento> findAgendamentos();
	
	//@Query("UPDATE Agendamento a SET a.status = 1 WHERE a.status = 0 AND a.id = :id")
	//public List<Agendamento> updatePendenteToAceito(@Param("id") Long id);
	
	//@Query("UPDATE Agendamento a SET a.status = 2 WHERE a.status = 0 AND a.id = :id")
	//public List<Agendamento> updatePendenteToRecusado(@Param("id") Long id);
	 
}