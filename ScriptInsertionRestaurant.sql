DROP TABLE IF EXISTS RESERVATION;
DROP TABLE IF EXISTS TABL;
DROP TABLE IF EXISTS RESTAURANT;
CREATE TABLE RESTAURANT(
    rst_idrst BIGINT,
    rst_nom VARCHAR(255),
    rst_adr varchar(255),
    rst_codP INT(5),
    rst_lon DECIMAL(5,3),
    rst_lat DECIMAL(5,3),
	PRIMARY KEY (rst_idrst));
    
CREATE TABLE TABL (
    tbl_idtbl BIGINT,
    tbl_numtbl INT,
    tbl_idrst BIGINT,
	tbl_plc INT,
    
	PRIMARY KEY (tbl_idtbl),
    FOREIGN KEY (tbl_idrst) REFERENCES RESTAURANT (rst_idrst));
    
CREATE TABLE RESERVATION (
    rsv_idrsv BIGINT, 
	rsv_idtbl BIGINT,
	rsv_dat DATE, 
	rsv_nbpers SMALLINT,
	PRIMARY KEY (rsv_idrsv, rsv_idtbl),
    FOREIGN KEY (rsv_idtbl) REFERENCES TABL (tbl_idtbl));
