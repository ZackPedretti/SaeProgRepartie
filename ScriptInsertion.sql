CREATE TABLE IF NOT EXISTS RESTAURANT(
    rst_idrst BIGINT,
    rst_nom VARCHAR(255),
    rst_adr varchar(255),
    rst_codP INT(5),
    rst_lon DECIMAL(5,3),
    rst_lat DECIMAL(5,3),
	PRIMARY KEY (rst_idrst));
    
CREATE TABLE IF NOT EXISTS TABL (
    tbl_idtbl BIGINT, 
    tbl_idrst BIGINT,
	tbl_plc INT,
    
	PRIMARY KEY (tbl_idtbl),
    FOREIGN KEY (tbl_idrst) REFERENCES RESTAURANT (rst_idrst));
    
CREATE TABLE IF NOT EXISTS RESERVATION (
    rsv_idrsv BIGINT, 
	rsv_idtbl BIGINT,
    rsv_idrst BIGINT,
	rsv_dat DATE, 
	rsv_nbpers SMALLINT,
	PRIMARY KEY (rsv_idrsv, rsv_idtbl, rsv_idrst),
    FOREIGN KEY (rsv_idtbl) REFERENCES TABL (tbl_idtbl),
    FOREIGN KEY (rsv_idrst) REFERENCES RESTAURANT (rst_idrst));
