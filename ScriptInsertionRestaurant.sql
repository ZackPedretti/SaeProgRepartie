DROP TABLE IF EXISTS RESERVATION;
DROP TABLE IF EXISTS TABL;
DROP TABLE IF EXISTS RESTAURANTS;
CREATE TABLE RESTAURANTS(
    rst_idrst BIGINT NOT NULL,
    rst_nom VARCHAR(255) NOT NULL,
    rst_adr varchar(255) NOT NULL,
    rst_codP INT(5) NOT NULL,
    rst_lon DECIMAL(8,6) NOT NULL,
    rst_lat DECIMAL(8,6) NOT NULL,
	PRIMARY KEY (rst_idrst));
    
CREATE TABLE TABL (
    tbl_idtbl BIGINT NOT NULL,
    tbl_numtbl INT NOT NULL,
    tbl_idrst BIGINT NOT NULL,
	tbl_plc INT NOT NULL,
    
	PRIMARY KEY (tbl_idtbl),
    FOREIGN KEY (tbl_idrst) REFERENCES RESTAURANTS (rst_idrst));
    
CREATE TABLE RESERVATION (
    rsv_idrsv BIGINT NOT NULL AUTO_INCREMENT, 
	rsv_idtbl BIGINT NOT NULL,
	rsv_dat DATE NOT NULL, 
	rsv_nbpers SMALLINT NOT NULL,
	PRIMARY KEY (rsv_idrsv, rsv_idtbl),
    FOREIGN KEY (rsv_idtbl) REFERENCES TABL (tbl_idtbl));

INSERT INTO `RESTAURANTS` (`rst_idrst`, `rst_nom`, `rst_adr`, `rst_codP`, `rst_lon`, `rst_lat`) VALUES ('1', 'KEBAB 5 ETOILES', '121 Rue Gabriel Mouilleron', '54000', '6.173026', '48.684509');
