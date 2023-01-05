import {program}  from 'commander';
import backup from  './commands/backup.js'
import {showChannels} from './commands/channel.js'
program
    .command('backup <cIndex>')
	.alias("b")
    .description('Download YouTube Channel videos.')
    .action(backup)	
	


program
    .command('show')
    .description('Show channels in database.')
    .action(showChannels)		
	
program.parse(process.argv)
	