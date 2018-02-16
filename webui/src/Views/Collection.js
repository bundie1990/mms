import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import 'react-virtualized/styles.css';
import { AutoSizer } from 'react-virtualized';
import { Table, Column } from 'react-virtualized';

import Server from 'server';

const styles = theme => ({
	root: {
		position: 'absolute', // For correct positioning of the virtual table
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
		overflowY: 'hidden',
	},
	table: {
		boxSizing: 'border-box',
		border: `0px solid ${theme.palette.divider}`,
		fontSize: theme.typography.pxToRem(14),
	},
	grid: {
		outline: 0,
	},
	row: {
		borderBottom: `1px solid ${theme.palette.divider}`,
	},
	cell: {
		textAlign: 'left',
		padding: '4px 2px 4px 4px',
	},
	cellRight: {
		textAlign: 'right',
		padding: '4px 10px 4px 4px',
	},
	cellHeader: {
		fontSize: theme.typography.pxToRem(12),
		fontWeight: theme.typography.fontWeightMedium,
		color: theme.palette.text.secondary,
	},
	cellInLastColumn: {
		paddingRight: theme.spacing.unit * 3
	},
	cellInLastRow: {
		borderBottom: 'none'
	},
	footer: {
		borderTop: `1px solid ${theme.palette.text.divider}`,
	}
});

class Collection extends Component {
	state = {
		tracks: [],
	}

	updateContent = (collection) => {
		this.setState({ tracks: [] });
		Server.getTracklist(collection).then(tracklist =>
			this.setState({ tracks: tracklist })
		);
	}

	componentDidMount = () => {
		this.updateContent(this.props.collection);
	}

	componentWillReceiveProps = (nextProps) => {
		if (this.props.collection.id !== nextProps.collection.id) {
			this.updateContent(nextProps.collection);
		}
	}

	getArtistCellData = ({ rowData }) => {
		if (rowData.artists)
			return rowData.artists.join('; ');
		else
			return '';
	}

	getDurationCellData = ({ rowData }) => {
		var duration = rowData.duration;
		if (duration >= 0) {
			var min = String(Math.trunc(duration / 60) + ':');
			var sec = String(Math.trunc(duration % 60));
			while (sec.length < 2)
				sec = '0' + sec;
			return min + sec;
		} else
			return '';
	}

	render() {
		const { classes } = this.props;

		return (
			<div className={classes.root}>
				<AutoSizer>
					{({ height, width }) => (
						<Table
							width={width}
							height={height}
							className={classes.table}
							gridClassName={classes.grid}
							disableHeader
							// headerHeight={20}
							rowHeight={48}
							rowCount={this.state.tracks.length}
							rowGetter={({ index }) => this.state.tracks[index]}
							rowClassName={classes.row}
						>
							<Column
								label='Name'
								dataKey='title'
								className={classes.cell}
								width={250}
								flexGrow={10}
							/>
							<Column
								label='Artist'
								dataKey='artists'
								width={250}
								flexGrow={10}
								className={classes.cell}
								cellDataGetter={this.getArtistCellData}
							/>
							<Column
								label='Album'
								dataKey='album'
								width={250}
								flexGrow={10}
								className={classes.cell}
							/>
							<Column
								label='Length'
								dataKey='duration'
								width={70}
								flexGrow={0}
								className={classes.cellRight}
								cellDataGetter={this.getDurationCellData}
							/>
						</Table>
					)}
				</AutoSizer>
			</div>
		);
	}
}

Collection.propTypes = {
	classes: PropTypes.object.isRequired,
	collection: PropTypes.object.isRequired,
};

export default withStyles(styles)(Collection);